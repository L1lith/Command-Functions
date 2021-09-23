import minimist from 'minimist'
import { sanitize } from 'sandhands'
import parseArgsObject from './parseArgsObject'

const nodeRegex = /node($|\.exe$)/ // For testing whether being called via a global command or via node
const rawArgsFormat = { _: [String], minLength: 0 } // Allow arrays of 0 or more non-empty strings

function readCLI(rawArgs, options = {}) {
  const { defaultCommand, getCommandName = true } = options
  if (!rawArgs) {
    rawArgs = [...process.argv]
  }

  sanitize(rawArgs, rawArgsFormat)
  if (nodeRegex.test(rawArgs[0])) {
    // Cut off an extra argument if the first command is node to compensate for the file path
    rawArgs.shift()
  }
  rawArgs.shift() // Cut off the first command (like "node" or any custom command)
  const args = minimist(rawArgs)
  let commandName = null
  if (getCommandName === true) {
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
  }

  const parsedArgs = parseArgsObject(args, { commandName, mode: 'cli' })
  //if (typeof parsedArgs.commandName != 'string') throw new Error('No Command Requested')
  //console.log(parsedArgs, config, config.commands[commandName], commandName)
  // if (commandName !== null && config.commands.hasOwnProperty(commandName)) {
  //   const command = config.commands[command]
  // }
  //if (!commandMap.hasOwnProperty(parsedArgs.commandName))
  //throw new Error(`Invalid command ${commandName} requested`)
  return parsedArgs
}

export default readCLI
