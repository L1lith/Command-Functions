import loadCommandsFolder from './loadCommandsFolder'
import normalizeFunctionArguments from './normalizeFunctionArguments'

function getExports(config = null) {
  const { commandMap } = config
  const exports = {}
  Object.values(commandMap).forEach(command => {
    exports[command.name] = function (...args) {
      const { options, primaryArgs } = normalizeFunctionArguments(args, {
        commandName: command.name
      })

      return command.handler(...primaryArgs, options)
    }
  })
  return exports
}

export default getExports
