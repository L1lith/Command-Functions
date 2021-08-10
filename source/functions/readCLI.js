import minimist from 'minimist'
import parseArgsObject from './parseArgsObject'

const nodeRegex = /node($|\.exe$)/ // For testing whether being called via a global command or via node

function readCLI(config, options, minimistOptions = null) {
  const { commandMap = {} } = config
  const { defaultCommand } = options
  let rawArgs
  if (Array.isArray(minimistOptions) && minimistOptions.length > 0) {
    rawArgs = minimistOptions
  } else {
    rawArgs = [...process.argv]
    if (nodeRegex.test(rawArgs[0])) {
      // Cut off an extra argument if the first command is node
      rawArgs.shift()
    }
    rawArgs.shift()
  }
  const args = minimist(rawArgs)
  let commandName = null
  if (
    Array.isArray(args._) &&
    typeof args._[0] === 'string' //&&
    //commandMap.hasOwnProperty(args._[0])
  ) {
    const commandRequest = args._[0]
    commandName = commandRequest
    args._.shift()
  } else if (defaultCommand) {
    commandName = defaultCommand
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
