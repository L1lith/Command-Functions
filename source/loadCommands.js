const {sanitize, Format, ANY} = require('sanitize')

const defaultOptions = {}
const nameFormat = Format(String).regex(/^[a-z0-9]+$/i)
const trimmedString = {_: String, trimmed: true}

const loadCommandOptions = {_: {
    defaultCommand: nameFormat
}, allOptional: true}

const commandOptionsFormat = {
    _: {
        inputs: {_: Object, standard: {
            format: ANY,
            normalize: Function,
            question: trimmedString
        }},
        defaultCommand: Boolean
    },
    allOptional: true
}

async function loadCommands(commandsFolder = null, options={}) {
  sanitize(options, loadCommandOptions)
  if (commandsFolder === null) commandsFolder = join(process.cwd(), 'commands')
  const files = await getFiles(commandsFolder, '*.js')
  const fileOutputs = await Promise.all(
    files.map(
      file =>
        new Promise((resolve, reject) => {
          try {
            resolve({ file: require(file), path: file })
          } catch (error) {
            const logError = error instanceof Error ? error : new Error(error)
            logError.message = 'Shinput: Error loading command: ' + logError.message
            console.error(logError)
            resolve(null)
          }
        })
    )
  )
  const requiredCommands = fileOutputs.filter(output => output !== null)
  if (requiredCommands.length < 1) throw new Error('Shinput: Found no valid commands!')
  const commandMap = {}
  let defaultCommand = null
  await Promise.all(
    requiredCommands.map(
      ({ file, path }) =>
        new Promise((resolve, reject) => {
          try {
            let options = {}
            let handler = null
            if (typeof file == 'object' && file !== null) {
              options = { ...options, ...file }
              if (!options.hasOwnProperty('handler'))
                throw new Error(
                  'Must supply a handler property in the options object for the command'
                )
              handler = options.handler
              delete options.handler
            } else if (typeof file == 'function') {
              handler = file
            } else {
              throw new Error(
                'Expected a options object or a command handler function, got: ' + String(file)
              )
            }
            if (typeof handler != 'function')
              throw new Error('The command handler should be a function')
            const name = options.hasOwnProperty('name')
              ? options.name
              : (await getCommandName(path))
            options = { ...defaultOptions, ...options }
            delete options.name
            sanitize(name, nameFormat)
            sanitize(options, commandOptionsFormat)
            if (options.defaultCommand === true) {
                if (defaultCommand !== null) {
                    const err = new Error("Found multiple default commands")
                    err.fatal = true
                    throw err
                }
                defaultCommand = name
            }
            const command = { options, handler, name }
            commandMap[name] = command
            resolve(command)
          } catch (error) {
            const logError = error instanceof Error ? error : new Error(error)
            logError.message = 'Shinput: Error parsing command file output: ' + logError.message
            if (logError.fatal !== false) {
                reject(logError)
            }
            console.error(logError)
            resolve(null)
          }
        })
    )
  )
  if (Object.keys(commandMap).length < 1) throw new Error("No valid commands found!")
  return {commandMap, defaultCommand}
}

export default loadCommands
