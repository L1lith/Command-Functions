import stripString from './stripString'
import { sanitize, valid } from 'sandhands'
import Options from './Options'

function createCommandHandler(commandConfig) {
  //console.log('n', commandConfig)
  const {
    allowBonusArgs = false,
    spreadArgs = true,
    noOptions = false,
    mode = 'node'
  } = commandConfig.options
  const optionsEntries = Object.entries(commandConfig.options.args)
  const allowedOptions = Object.keys(commandConfig.options.args)
  let primaryOptions = []
  const requiredOptions = optionsEntries
    .filter(([key, config]) => config.required === true)
    .map(([key, config]) => key)

  const defaults = {}
  optionsEntries.forEach(([arg, config]) => {
    if (config.hasOwnProperty('argsPosition')) {
      if (primaryOptions.hasOwnProperty(config.argsPosition))
        throw new Error(`Overlapping Options on Args Position ${config.argsPosition}`)
      primaryOptions[config.argsPosition] = arg
    }
    if (config.hasOwnProperty('default')) {
      defaults[arg] = config.default
    }
  })
  for (let i = 0; i < primaryOptions.length; i++) {
    if (!(i in primaryOptions)) throw new Error('Non-consecutive primary options received')
  }

  return (...args) => {
    let options = {}
    if (args.length > 0) {
      const lastArg = args[args.length - 1]
      if (lastArg instanceof Options) {
        // Providing Options
        options = lastArg
        args.pop()
      }
    }
    const argsOutput = { ...defaults }
    const primaryArgs = []
    //if (!Array.isArray(args)) throw new Error('args must be an array')
    //if (typeof options !== 'object') throw new Error('Options must be an object')
    if (args.length > 0) {
      args.forEach((value, index) => {
        if (!allowBonusArgs && index >= primaryOptions.length)
          throw new Error(`Received too many primary arguments.`)
        const argName = primaryOptions[index]
        if (typeof argName == 'string') {
          // if (argsOutput.hasOwnProperty(argName))
          //   throw new Error(
          //     `Found overlapping options and primary args for the argument "${argName}"`
          //   )
          argsOutput[argName] = value
        } else {
          primaryArgs[index] = value
        }
      })
    }
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
    Object.entries(argsOutput).forEach(([arg, value]) => {
      const argOptions = commandConfig.options.args[arg] || {}
      const { argsPosition } = argOptions
      if (argOptions.hasOwnProperty('normalize')) {
        value = argOptions.normalize(value)
      }
      if (argOptions.hasOwnProperty('format')) sanitize(value, argOptions.format)
      // TODO: Figure this out
      if (isFinite(argsPosition) && argsPosition >= 0) {
        primaryArgs[argsPosition] = value
      }
    })
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

export default createCommandHandler
