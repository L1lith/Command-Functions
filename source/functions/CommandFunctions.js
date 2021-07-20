import parseCommand from './parseCommand'
import getExports from './getExports'
import readCLI from './readCLI'
import stripProperties from './stripProperties'
import { sanitize } from 'sandhands'

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
    this.exports = null
  }
  getExports() {
    if (this.exports !== null) return this.exports
    let newExports = getExports(this.commandsConfig, this.commandsOptions)
    if (typeof this.options.exports == 'object' && this.options.exports !== null) {
      newExports = { ...this.options.exports, ...newExports }
    }
    return (this.exports = newExports)
  }
  async runCLI(...minimistOptions) {
    const cliArgs = await readCLI(this.commandsConfig, this.commandsOptions, minimistOptions)
    const exports = this.getExports()
    const { commandName, options, primaryArgs = [], format } = cliArgs
    if (!exports.hasOwnProperty(commandName))
      throw new Error('Missing the export for the command ' + commandName)
    if (cliArgs.hasOwnProperty('format')) {
      sanitize({ ...options, _: primaryArgs }, format)
    }
    let output
    if (typeof options == 'object' && options !== null) {
      output = await exports[commandName](...primaryArgs, options)
    } else {
      output = await exports[commandName](...primaryArgs)
    }
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
}

export default CommandFunctions
