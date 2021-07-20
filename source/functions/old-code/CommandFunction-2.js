import autoBind from 'auto-bind'
import { sanitize, ANY } from 'sandhands'
import parseArgs from '../parseArgs'
import stripProperties from '../stripProperties'
import CommandInput from '../CommandInput'

const trimmedString = { _: String, trimmed: true }

const optionsFormat = {
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
        allOptional: true
      }
    },
    defaultCommand: Boolean,
    name: { _: String, regex: /^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])$/i }
  },
  optionalProps: ['']
}

class CommandFunction {
  constructor(options = {}, name) {
    if (typeof options == 'object' && options !== null) {
      this.options = options = { ...options }
    } else {
      throw new Error('Options must be an object')
    }
    if (typeof name == 'string') options.name = name
    if (this.options.inputs === null) this.options.inputs = {}
    sanitize(options, optionsFormat)
    this.options = options
    autoBind(this)
  }
  executeCommand(commandInput) {
    if (!(commandInput instanceof CommandInput))
      throw new Error('Please supply a CommandInput instance')
    const { commandName } = commandInput.args
  }
}

class CommandOptions {
  constructor(args) {}
}

export default Object.freeze(CommandFunction)
