import { sanitize, Format, ANY } from 'sandhands'
import { glob } from 'micro-fs'
import { join, basename } from 'path'
import getFileName from './getFileName'
import parseCommand from './parseCommand'

const defaultOptions = {}

const whitespaceRegex = /[\s]+/g

const loadCommandOptions = {
  _: {},
  allOptional: true
}

async function loadCommandsFolder(commandsFolder = null, options = {}) {
  sanitize(options, loadCommandOptions)
  if (commandsFolder === null) commandsFolder = join(process.cwd(), 'commands')
  const output = {}
  const files = (await glob(join(commandsFolder, '*.js'))).map(file => file.path)
  const fileOutputs = await Promise.all(
    files.map(async file => ({ file: await import(file), path: file }))
  )
  const requiredCommands = fileOutputs.filter(output => output !== null)
  if (requiredCommands.length < 1) throw new Error('Shinput: Found no valid commands!')
  const commandMap = {}
  let defaultCommand = null
  await Promise.all(
    requiredCommands.map(async ({ file, path }) => {
      const commandOptions = parseCommand(file, { defaultName: getFileName(path) })
      commandMap[commandOptions.name] = commandOptions
      if (commandOptions.defaultCommand === true) {
        if (defaultCommand !== null) throw new Error('Found multiple default commands')
        defaultCommand = commandOptions.name
      }
    })
  )
  if (Object.keys(commandMap).length < 1) throw new Error('No valid commands found!')
  output.commandMap = commandMap
  if (defaultCommand !== null) output.defaultCommand = defaultCommand
  return output
}

export default loadCommandsFolder
