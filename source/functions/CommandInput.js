import { sanitize } from 'sandhands'

const argsFormat = {
  primaryArgs: Array,
  commandName: { _: String, regex: /^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])$/i },
  options: Object
}

class CommandInput {
  constructor(args) {
    sanitize(args, argsFormat)
    this.args = args
  }
  static fromFunctionArgs(args, options) {
    if (!Array.isArray(args)) throw new Error('Please supply an argument array')
    const { commandName, parseOptions = true } = options
    let object = {}
    const parserOptions = stripProperties(options, ['commandName', 'primaryArgs'])
    if (typeof commandName == 'string') parserOptions.commandName = commandName
    const lastArg = args[args.length - 1]
    if (parseOptions === true && lastArg !== null && typeof lastArg == 'object') {
      object = lastArg
      parserOptions.primaryArgs = args.slice(0, args.length - 1)
    } else {
      parserOptions.primaryArgs = args
    }
    return this.parseCLIOptions(object, parserOptions)
  }
  static fromCLIOptions(argsObject, parserOptions = {}) {
    //if (!Array.isArray(args)) throw new Error('Please supply an argument array')
    let options = { ...argsObject }
    const { commandName = null } = parserOptions
    let { primaryArgs = [] } = parserOptions
    if (
      (primaryArgs.length > 0) +
        (Array.isArray(options._) && options._.length > 0) +
        (typeof commandName == 'string' &&
          Array.isArray(options[commandName]) &&
          options[commandName].length) >
      1
    )
      throw new Error(
        'Cannot supply more than one set of primary arguments, either through the command name, the function parameters, or the _ property'
      )
    primaryArgs =
      primaryArgs?.length > 0
        ? primaryArgs
        : options?._?.length > 0
        ? options._
        : typeof commandName == 'string' && options[commandName]?.length > 0
        ? options[commandName]
        : []
    delete options[commandName]
    delete options._
    //console.log({ options, primaryArgs, commandName })
    return new CommandInput({ options, primaryArgs, commandName }) // Object.assign(, { options, primaryArgs, commandName })
  }
}

export default CommandInput
