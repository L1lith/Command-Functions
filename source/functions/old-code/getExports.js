import loadCommandsFolder from './loadCommandsFolder'
import normalizeFunctionArguments from './normalizeFunctionArguments'

const configFormat = {
  _: {
    commands: { _: Object, strict: false }
  },
  allOptional: true
}

function getExports(config = null) {
  const { commands, commandDir } = config
  const exports = {}
  Object.values(commands).forEach(command => {
    exports[command.name] = function (...args) {
      const { options, primaryArgs } = normalizeFunctionArguments(args, command)
      return command.handler(primaryArgs, options)
    }
  })
  return exports
}

export default getExports
