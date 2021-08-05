import minimist from 'minimist'
import parseArgsObject from './parseArgsObject'

function readCLI(config, options, minimistOptions = null) {
  const { commandMap = {} } = config
  const { defaultCommand } = options
  let rawArgs
  if (Array.isArray(minimistOptions) && minimistOptions.length > 0) {
    rawArgs = minimistOptions
  } else {
    rawArgs = process.argv
    if (rawArgs[0].endsWith('node.exe') || rawArgs[0] === 'node') {
      // Cut off an extra argument if the first command is node
      rawArgs = rawArgs.slice(2)
    } else {
      rawArgs = rawArgs.slice(1)
    }
  }

  const args = minimist(rawArgs)
  let commandName = defaultCommand || null
  if (
    Array.isArray(args._) &&
    typeof args._[0] === 'string' &&
    (commandName === null || commandMap.hasOwnProperty(args._[0]))
  ) {
    const commandRequest = args._[0]
    commandName = commandRequest
    args._ = args._.slice(1)
  }

  const parsedArgs = parseArgsObject(args, { commandName, mode: 'cli' })
  if (typeof parsedArgs.commandName != 'string') throw new Error('No Command Requested')
  //console.log(parsedArgs, config, config.commands[commandName], commandName)
  if (config.commands.hasOwnProperty(commandName)) {
    const command = config.commands[command]
  }
  //if (!commandMap.hasOwnProperty(parsedArgs.commandName))
  //throw new Error(`Invalid command ${commandName} requested`)
  return parsedArgs
}

export default readCLI
