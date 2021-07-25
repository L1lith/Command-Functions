import parseCommand from './parseCommand'
import readCLI from './readCLI'
import stripProperties from './stripProperties'
import { sanitize } from 'sandhands'
import { inspect } from 'util'
import onlyUnique from './onlyUnique'
import stripString from './stripString'
import createCommandHandler from './createCommandHandler'

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
    this.options = options
    commandsConfig.commands = commandMap
    commandsConfig.defaultCommand = defaultCommand
    if (typeof options?.exports == 'object' && options?.exports !== null) {
      this.staticExports = options.exports
    } else {
      this.staticExports = {}
    }
    this.propertyList = Object.keys(this.commandsConfig.commands)
      .concat(Object.keys(this.staticExports))
      .filter(onlyUnique)
    this.options = options
    this.commandsOptions = stripProperties(this.options, ['defaultCommand'], true)
    this.getExports = this.getExports.bind(this)
    this.runCLI = this.runCLI.bind(this)
    this.autoRun = this.autoRun.bind(this)
    this.exports = null
  }
  // getExports() {
  //   if (this.exportsObject !== null) return this.exportsObject
  //   let newExports = getExports(this.commandsConfig, this.commandsOptions)
  //   if (typeof this.options.exports == 'object' && this.options.exports !== null) {
  //     newExports = { ...this.options.exports, ...newExports }
  //   }
  //   return (this.exportsObject = newExports)
  // }
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
    //console.log(inspect(output))
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
  getExports() {
    if (this.exports !== null) return this.exports
    const output = {}
    this.propertyList.forEach(property => {
      output[property] = this.getExport(property)
    })
    this.exports = output
    return output
  }
  getExport(name = null) {
    if (name === null) name = this.commandsConfig.defaultCommand
    if (typeof name != 'string') throw new Error('Invalid Command Name')

    const searchName = stripString(name)
    const commandMatch = Object.keys(this.commandsConfig.commands).find(
      commandName => stripString(commandName) === searchName
    )
    const exportMatch = Object.keys(this.staticExports).find(
      exportName => stripString(exportName) === searchName
    )
    if (commandMatch && exportMatch) throw new Error('Found duplicate exports for ' + name)
    let output
    if (commandMatch) {
      const commandConfig = this.commandsConfig.commands[commandMatch]
      output = createCommandHandler(commandConfig)
    } else if (exportMatch) {
      output = this.staticExports[exportMatch]
    } else {
      if (!commandMatch && !exportMatch)
        throw new Error(`Missing the command "${name}", try the help command`)
    }
    return output
  }
}

export default CommandFunctions
