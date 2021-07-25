import stripString from './stripString'
import { sanitize } from 'sandhands'

function createCommandHandler(commandConfig) {
  console.log('n', commandConfig)
  const allowedOptions = Object.keys(commandConfig.options.args)
  const expectedPrimaryArgs = commandConfig.options.primaryArgs
  return args => {
    const argsOutput = {}
    const primaryArgs = []
    if (args.hasOwnProperty('_')) {
      if (args._.length !== expectedPrimaryArgs.length)
        throw new Error(`Expected ${expectedPrimaryArgs.length} primary arguments`)
      expectedPrimaryArgs.forEach((expectedArg, index) => {
        args[expectedArg] = args._[index]
      })
    }
    Object.entries(args).forEach(([arg, value]) => {
      if (arg === '_') return // skip for now
      const argSearchString = stripString(arg)
      const argMatch = allowedOptions.find(option => stripString(option) === argSearchString)
      if (!argMatch) throw new Error(`The argument "${arg}" is not accepted by the command`)
      const argOptions = commandConfig.options.args[arg]
      if (argOptions.hasOwnProperty('format')) sanitize(value, argOptions.format)
      const primaryArgsPosition = commandConfig.options.primaryArgs.indexOf(argMatch)
      if (primaryArgsPosition >= 0) {
        primaryArgs[primaryArgsPosition] = value
      }
      argsOutput[argMatch] = value
    })
    return commandConfig.handler(...primaryArgs, argsOutput)
  }
}

export default createCommandHandler
