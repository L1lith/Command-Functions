import { sanitize, Format, ANY } from 'sandhands'
import stripString from '../stripString'

const trimmedString = { _: String, trimmed: true }
const normalInt = { _: Number, min: 0, finite: true, integer: true }

const nameFormat = Format(String)
  .regex(/^[a-z0-9]+$/i)
  .nullable()

const aliasFormat = {
  _: [String],
  validate: strings =>
    strings.every((string, index) => strings.indexOf(string) === index) ||
    'all aliases must be unique'
}

const commandOptionsFormat = {
  _: {
    args: {
      _: Object,
      standard: {
        _: {
          format: ANY,
          normalize: Function,
          question: trimmedString,
          default: ANY,
          getDefault: Function,
          required: Boolean,
          prompt: String,
          argsPosition: { _: Number, integer: true, min: 0 } // The argument order priority
          //primaryArgsList: Boolean // Enable to get an array of all arguments that match
        },
        validate: obj =>
          !obj.hasOwnProperty('default') ||
          !obj.hasOwnProperty('getDefault') ||
          'Cannot supply the getDefault and the default prop at the same time',
        allOptional: true,
        nullable: true
      },
      nullable: true
    },
    defaultCommand: String,
    aliases: aliasFormat,
    spreadArgs: Boolean,
    allowBonusArgs: Boolean,
    noOptions: Boolean,
    description: String,
    silent: Boolean
  },
  validate: config =>
    !config.hasOwnProperty('primaryArgs') ||
    (typeof config.args == 'object' &&
      config.args !== null &&
      config.primaryArgs.every(arg => config.args.hasOwnProperty(arg)))
      ? true
      : 'Invalid Primary Args',
  allOptional: true
}

const parserOptionsFormat = { _: { defaultName: { _: String, nullable: true } }, allOptional: true }

function parseCommandOptions(input, parserOptions = {}) {
  sanitize(parserOptions, parserOptionsFormat)
  const { defaultName = null } = parserOptions
  let options = { args: {} }
  let handler = null
  if (typeof input == 'object' && input !== null) {
    options = { ...options, ...input }
    if (!options.hasOwnProperty('handler'))
      throw new Error('Must supply a handler property in the options object for the command')
    handler = options.handler
    delete options.handler
  } else if (typeof input == 'function') {
    handler = input
  } else {
    throw new Error(
      'Expected a options object or a command handler function, got: ' + String(input)
    )
  }
  if (typeof handler != 'function') throw new Error('The command handler should be a function')
  const name = options.hasOwnProperty('name') ? options.name : defaultName || handler.name || null
  //options = { ...defaultOptions, ...options }
  delete options.name
  sanitize(name, nameFormat)
  sanitize(options, commandOptionsFormat)
  if (options.hasOwnProperty('args')) {
    Object.entries(options.args).forEach(([arg, config]) => {})
  }
  if (options.hasOwnProperty('aliases'))
    options.aliases = options.aliases
      .map(alias => stripString(alias))
      .filter(string => string && string !== name) //remove empty strings and duplicates of the input name
  //if (options.hasOwnProperty('inputs'))
  //  options.inputs = options.inputs.map(input => (input === null ? {} : input)) // Replace the null input options with blank objects
  return { options, handler, name }
}

export default parseCommandOptions
