import { sanitize } from 'sandhands'
import parseArgsObject from './parseArgsObject'

const optionsFormat = {
  _: {
    parseOptions: Boolean,
    commandName: String
  },
  allOptional: true
}

function normalizeFunctionArguments(args = [], options = {}) {
  if (!Array.isArray(args)) throw new Error('Please supply an argument array')
  const { commandName, parseOptions = true } = options
  let object = {}
  const parserOptions = {}
  if (typeof commandName == 'string') parserOptions.commandName = commandName
  const lastArg = args[args.length - 1]
  if (parseOptions === true && lastArg !== null && typeof lastArg == 'object') {
    object = lastArg
    parserOptions.primaryArgs = args.slice(0, args.length - 1)
  } else {
    parserOptions.primaryArgs = args
  }
  return parseArgsObject(object, parserOptions)
}

export default normalizeFunctionArguments
