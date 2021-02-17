import { sanitize, Format, ANY } from 'sandhands'

const trimmedString = { _: String, trimmed: true }

const nameFormat = Format(String).regex(/^[a-z0-9]+$/i)

const commandOptionsFormat = {
  _: {
    inputs: {
      _: Object,
      standard: {
        _: {
          format: ANY,
          normalize: Function,
          question: trimmedString,
          default: ANY
        },
        allOptional: true,
        nullable: true
      },
      nullable: true
    },
    defaultCommand: Boolean
  },
  allOptional: true
}

const parserOptionsFormat = { _: { defaultName: { _: String, nullable: true } }, allOptional: true }

function parseCommandOptions(input, parserOptions = {}) {
  sanitize(parserOptions, parserOptionsFormat)
  const { defaultName = null } = parserOptions
  let options = {}
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
  const name = options.hasOwnProperty('name') ? options.name : defaultName
  //options = { ...defaultOptions, ...options }
  delete options.name
  sanitize(name, nameFormat)
  sanitize(options, commandOptionsFormat)
  if (options.defaultCommand === true) {
    if (defaultCommand !== null) {
      const err = new Error('Found multiple default commands')
      err.fatal = true
      throw err
    }
    defaultCommand = name
  }
  if (options.hasOwnProperty('inputs'))
    options.inputs = options.inputs.map(input => (input === null ? {} : input)) // Replace the null input options with blank objects
  return { options, handler, name }
}

export default parseCommandOptions
