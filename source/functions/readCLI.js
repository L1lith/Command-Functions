import minimist from 'minimist'
import parseArgsObject from './parseArgsObject'

const nodeRegex = /(\\|\/|^)node$/
const spacingRegex = /[\s\-]+/g

function readCLI(config, options, minimistOptions = null) {
  const { commandMap, defaultCommand } = config
  const {} = options
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
  if (nodeRegex.test(process.argv[0])) {
    // Executed VIA Node, trim out file path from argsObject
    args._ = args._.slice(1)
  }
  const searchName = args._[0].toLowerCase().replace(spacingRegex, '')
  let commandName = defaultCommand || null
  if (searchName.length > 0) {
    const matchCommand =
      Object.keys(commandMap).find(
        value => value.toLowerCase().replace(spacingRegex, '') === searchName
      ) || null
    if (matchCommand !== null) commandName = matchCommand
    args._ = args._.slice(1)
  }

  if (
    Array.isArray(args._) &&
    typeof args._[0] === 'string' &&
    commandMap.hasOwnProperty(args._[0])
  ) {
    const commandRequest = args._[0]
    commandName = commandRequest
    args._ = args._.slice(1)
  }

  const parsedArgs = parseArgsObject(args, { commandName })
  if (typeof parsedArgs.name != 'string') throw new Error('No Command Requested')
  if (!commandMap.hasOwnProperty(parsedArgs.name))
    throw new Error(`Invalid command ${name} requested`)
  return parsedArgs
}

export default readCLI
