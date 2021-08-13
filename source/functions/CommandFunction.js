import stripString from './stripString'
import { sanitize, valid } from 'sandhands'
import Options from './Options'
import argPrompt from './argPrompt'
import autoNormalize from './autoNormalize'
import ParsedCommandOptions from './ParsedCommandOptions'

const allowedParserOptions = ['defaultName']

class CommandFunction {
  constructor(config, options = {}, parserOptions = {}) {
    const commandConfig = (this.commandConfig =
      config instanceof ParsedCommandOptions ? config : new ParsedCommandOptions(config))
    this.options = options
    if (this.options.mode === undefined) this.options.mode = 'node'
    const { mode } = this.options
    const optionsEntries = Object.entries(commandConfig.options.args)
    this.allowedOptions = Object.keys(commandConfig.options.args)
    const primaryOptions = (this.primaryOptions = [])
    this.requiredOptions = optionsEntries
      .filter(([key, config]) => config.required === true)
      .map(([key, config]) => key)

    const defaults = (this.defaults = {})
    const defaultGetters = (this.defaultGetters = {})
    optionsEntries.forEach(([arg, config]) => {
      if (config.hasOwnProperty('argsPosition')) {
        if (primaryOptions.hasOwnProperty(config.argsPosition))
          throw new Error(`Overlapping Options on Args Position ${config.argsPosition}`)
        primaryOptions[config.argsPosition] = arg
      }

      if (config.hasOwnProperty('prompt') && mode === 'cli') {
        defaultGetters[arg] = () => argPrompt(config.prompt, config)
        //console.log(arg, config, mode, config.hasOwnProperty('prompt'), mode === 'cli')
        // Object.defineProperty(this.defaults, arg, {
        //   get: () => argPrompt(config.prompt, config),
        //   enumerable: true
        // })
      } else if (config.hasOwnProperty('getDefault')) {
        defaultGetters[arg] = () => config.getDefault(mode)
        // Object.defineProperty(this.defaults, arg, {
        //   get: () => config.getDefault(mode),
        //   enumerable: true
        // })
      }
      if (config.hasOwnProperty('default')) {
        defaults[arg] = config.default
      }
    })
    for (let i = 0; i < primaryOptions.length; i++) {
      if (!(i in primaryOptions)) throw new Error('Non-consecutive primary options received')
    }

    this.execute = this.execute.bind(this)
  }
  execute(...args) {
    const {
      primaryOptions,
      defaultGetters,
      defaults,
      allowedOptions,
      requiredOptions,
      commandConfig
    } = this

    const { mode } = this.options
    const { allowBonusArgs = false, spreadArgs = true, noOptions = false } = commandConfig.options

    const argsOutput = {}
    const primaryArgs = []

    let options = {}
    if (args.length > 0) {
      const lastArg = args[args.length - 1]
      if (lastArg instanceof Options) {
        // Providing Options
        options = lastArg
        args.pop()
      }
      args.forEach((value, index) => {
        if (!allowBonusArgs && index >= primaryOptions.length)
          throw new Error(`Received too many primary arguments.`)
        const argName = primaryOptions[index]
        if (typeof argName == 'string') {
          const argConfig = commandConfig.options.args[argName] || {}
          setArg(argsOutput, primaryArgs, argName, argConfig, value)
        } else {
          primaryArgs[index] = value
        }
      })
    }

    Object.keys(defaultGetters).forEach(key => {
      if (!(key in argsOutput)) {
        const output = defaultGetters[key]()
        //(key, output)
        const argConfig = commandConfig.options.args[key] || {}
        setArg(argsOutput, primaryArgs, key, argConfig, output, { throw: false })
      }
    })
    Object.keys(defaults).forEach(key => {
      if (!(key in argsOutput)) {
        const output = defaults[key]
        const argConfig = commandConfig.options.args[key] || {}
        setArg(argsOutput, primaryArgs, key, argConfig, output, { throw: false })
      }
    })
    //if (!Array.isArray(args)) throw new Error('args must be an array')
    //if (typeof options !== 'object') throw new Error('Options must be an object')

    if (typeof options == 'object' && options !== null)
      Object.entries(options).forEach(([arg, value]) => {
        if (arg === '_') return // skip for now
        const argSearchString = stripString(arg)
        const argMatch = allowedOptions.find(option => stripString(option) === argSearchString)
        if (!argMatch) throw new Error(`The argument "${arg}" is not accepted by the command`)
        argsOutput[argMatch] = value
      })

    requiredOptions.forEach(requiredOption => {
      if (!argsOutput.hasOwnProperty(requiredOption))
        throw new Error(`Missing the "${requiredOption}" argument`)
    })
    // Object.entries(argsOutput).forEach(([arg, value]) => {
    //   const argOptions = commandConfig.options.args[arg] || {}
    //   const { argsPosition } = argOptions
    //   if (argOptions.hasOwnProperty('normalize')) {
    //     value = argOptions.normalize(value)
    //   }
    //   if (argOptions.hasOwnProperty('format')) {
    //     console.log('m', arg, value, this)
    //     sanitize(value, argOptions.format)
    //   }
    //   // TODO: Figure this out
    //   if (isFinite(argsPosition) && argsPosition >= 0) {
    //     primaryArgs[argsPosition] = value
    //   }
    // })
    argsOutput.mode = mode
    let outputArgs = []
    if (spreadArgs === true) {
      outputArgs = [...primaryArgs]
    } else {
      outputArgs = [primaryArgs]
    }
    if (noOptions !== true) {
      outputArgs.push(new Options(argsOutput))
    }
    return commandConfig.handler.apply(null, outputArgs)
  }
}

function setArg(outputArgs, primaryArgs, argName, argConfig, value, options = {}) {
  const shouldThrow = options.throw === true
  const { normalize, format, argsPosition } = argConfig
  if (argConfig.hasOwnProperty('format')) value = autoNormalize(value, format)
  if (argConfig.hasOwnProperty('normalize')) {
    value = normalize(value)
  }
  if (argConfig.hasOwnProperty('format')) {
    try {
      sanitize(value, format)
    } catch (err) {
      if (shouldThrow) {
        err.message = 'Received Invalid Arg Value: '
        throw err
      } else {
        return false // Fail silently instead of throwing
      }
    }
  }
  if (isFinite(argsPosition) && argsPosition >= 0 && !primaryArgs.hasOwnProperty(argsPosition)) {
    primaryArgs[argsPosition] = value
  }
  outputArgs[argName] = value
  return true
}

export default CommandFunction
