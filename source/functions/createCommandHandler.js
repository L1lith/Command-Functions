import stripString from './stripString'
import { sanitize, valid } from 'sandhands'
import Options from './Options'

function createCommandHandler(commandConfig) {
  //console.log('n', commandConfig)
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
      primaryOptions[config.argsPosition] = config.name
    }
  })
  for (let i = 0; i < primaryOptions.length; i++) {
    if (!(i in primaryOptions)) throw new Error('Non-consecutive primary options received')
  }

  return (...args) => {
    let options = null
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
      args.forEach((primaryArg, index) => {
        if (index >= primaryOptions.length) throw new Error(`Received too many primary arguments.`)
        const argOptions = primaryOptions[index]
        const normalizedValue = argOptions.hasOwnProperty('normalize')
          ? argOptions.normalize(primaryArg)
          : primaryArg
        if (argOptions.hasOwnProperty('format')) {
          if (valid(normalizedValue, argOptions.format)) {
            // We found a valid primary argument
            primaryArgs.push(normalizedValue)
            argsOutput[argOptions.name] = normalizedValue
          }
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
      if (argOptions.hasOwnProperty('normalize')) {
        value = argOptions.normalize(value)
      }
      if (argOptions.hasOwnProperty('format')) sanitize(value, argOptions.format)
      // TODO: Figure this out
      const primaryArgsPosition = commandConfig.options.primaryArgs.indexOf(arg)
      if (primaryArgsPosition >= 0) {
        primaryArgs[primaryArgsPosition] = value
      }
    })
    return commandConfig.handler(...primaryArgs, new Options(argsOutput))
  }
}

export default createCommandHandler
