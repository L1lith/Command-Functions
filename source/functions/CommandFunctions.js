import parseCommand from './parseCommand'
import getExports from './getExports'
import readCLI from './readCLI'
import stripProperties from './stripProperties'
import { sanitize } from 'sandhands'
import { inspect } from 'util'

const stripFluffRegex = /[\-\.\s]+/gi

class CommandFunctions {
  constructor(commandFunctions, options = {}) {
    const commandsConfig = (this.commandsConfig = {})
    const commandMap = {}
    let defaultCommand = null
    Object.entries(commandFunctions).forEach(([commandName, commandConfig]) => {
      const commandOptions = parseCommand(commandConfig, { defaultName: commandName })
      commandMap[commandOptions.name] = commandOptions
      if (commandOptions.defaultCommand === true) {
        if (defaultCommand !== null) throw new Error('Found multiple default commands')
        defaultCommand = commandOptions.name
      }
    })
    commandsConfig.commands = commandMap
    commandsConfig.defaultCommand = defaultCommand
    this.options = options
    this.commandsOptions = stripProperties(this.options, ['defaultCommand'], true)
    this.getExports = this.getExports.bind(this)
    this.runCLI = this.runCLI.bind(this)
    this.autoRun = this.autoRun.bind(this)
    this.exportsObject = null
  }
  getExports() {
    if (this.exportsObject !== null) return this.exportsObject
    let newExports = getExports(this.commandsConfig, this.commandsOptions)
    if (typeof this.options.exports == 'object' && this.options.exports !== null) {
      newExports = { ...this.options.exports, ...newExports }
    }
    return (this.exportsObject = newExports)
  }
  async runCLI(...minimistOptions) {
    const cliArgs = await readCLI(this.commandsConfig, this.commandsOptions, minimistOptions)
    const { commandName, options, primaryArgs = [], format } = cliArgs
    if (cliArgs.hasOwnProperty('format')) {
      sanitize({ ...options, _: primaryArgs }, format)
    }

    let output = this.getExport(commandName)
    if (typeof output == 'function') {
      output = output(...primaryArgs, options)
    }
    output = await output
    console.log(inspect(output))
    return output
  }
  autoRun(doExit = true) {
    const isParentShell = require.main === module.parent
    if (isParentShell) {
      this.runCLI()
        .then(() => {
          if (doExit === true) {
            process.exit(0)
          }
        })
        .catch(error => {
          console.error(error)
          if (doExit === true) {
            process.exit(1)
          }
        })
      return null
    } else {
      return this.getExports()
    }
  }
  getExport(name, exportsObject = null) {
    if (typeof name != 'string') throw new Error('Invalid Command Name')
    if (exportsObject === null) exportsObject = this.getExports()
    const searchName = name.replace(stripFluffRegex, '').toLowerCase()
    const match = Object.keys(exportsObject).find(
      key => key.replace(stripFluffRegex, '').toLowerCase() === searchName
    )
    if (!match) throw new Error(`Missing the command "${name}", try the help command`)
    return exportsObject[match]
  }
}

export default CommandFunctions
