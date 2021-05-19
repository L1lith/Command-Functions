import loadCommandsFolder from './loadCommandsFolder'
import normalizeFunctionArguments from './normalizeFunctionArguments'
import { sanitize } from 'sandhands'

function getExports(config = null) {
  const { commandMap } = config
  const exports = {}
  Object.values(commandMap).forEach(command => {
    exports[command.name] = function (...args) {
      var { options, primaryArgs } = normalizeFunctionArguments(args, command)
      if (typeof command.inputs == 'object' && command.inputs !== null)
        Object.entries(command.inputs).forEach(([inputName, input]) => {
          let value
          if (inputName === '_') {
            value = primaryArgs
          } else {
            if (!options.hasOwnProperty(inputName)) return // No need to normalize an unsupplied input
            value = options[inputName]
          }
          if (input.hasOwnProperty('normalize')) value = input.normalize(value)
          if (input.hasOwnProperty('format')) sanitize(value, input.format)
          if (inputName === '_') {
            primaryArgs = Array.isArray(value) ? value : [value]
          } else {
            options[inputName] = value
          }
        })
      return command.handler(...primaryArgs, options)
    }
  })
  return exports
}

export default getExports
