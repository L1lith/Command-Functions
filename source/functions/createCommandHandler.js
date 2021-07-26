import stripString from './stripString'
import { sanitize } from 'sandhands'
import Options from './Options'

function createCommandHandler(commandConfig) {
  //console.log('n', commandConfig)
  const allowedOptions = Object.keys(commandConfig.options.args)
  const expectedPrimaryArgs = commandConfig.options.primaryArgs
  const requiredOptions = Object.entries(commandConfig.options.args)
    .filter(([key, config]) => config.required === true)
    .map(([key, config]) => key)
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
    const argsOutput = {}
    const primaryArgs = []
    if (!Array.isArray(args)) throw new Error('args must be an array')
    //if (typeof options !== 'object') throw new Error('Options must be an object')
    if (args.length > 0) {
      if (args.length !== expectedPrimaryArgs.length)
        throw new Error(`Expected ${expectedPrimaryArgs.length} primary arguments`)
      expectedPrimaryArgs.forEach((expectedArg, index) => {
        primaryArgs[index] = argsOutput[expectedArg] = args[index]
      })
    }
    if (typeof options == 'object' && options !== null)
      Object.entries(options).forEach(([arg, value]) => {
        if (arg === '_') return // skip for now
        const argSearchString = stripString(arg)
        const argMatch = allowedOptions.find(option => stripString(option) === argSearchString)
        if (!argMatch) throw new Error(`The argument "${arg}" is not accepted by the command`)
        const primaryArgsPosition = commandConfig.options.primaryArgs.indexOf(argMatch)
        if (primaryArgsPosition >= 0) {
          if (primaryArgs.hasOwnProperty(primaryArgsPosition))
            throw new Error(
              `Duplicate Argument Received for Primary Argument #${
                primaryArgsPosition + 1
              } "${arg}"`
            )
          primaryArgs[primaryArgsPosition] = value
        }
        argsOutput[argMatch] = value
      })
    requiredOptions.forEach(requiredOption => {
      if (!argsOutput.hasOwnProperty(requiredOption))
        throw new Error(`Missing the "${requiredOption}" argument`)
    })
    Object.entries(argsOutput).forEach(([arg, value]) => {
      const argOptions = commandConfig.options.args[arg] || {}
      if (argOptions.hasOwnProperty('format')) sanitize(value, argOptions.format)
    })
    return commandConfig.handler(primaryArgs, argsOutput)
  }
}

export default createCommandHandler
