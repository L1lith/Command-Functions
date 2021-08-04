import parseCommand from './parseCommand'
import readCLI from './readCLI'
import stripProperties from './stripProperties'
import { sanitize } from 'sandhands'
import { inspect } from 'util'
import onlyUnique from './onlyUnique'
import stripString from './stripString'
import createCommandHandler from './createCommandHandler'
import Options from './Options'
import autoBind from 'auto-bind'

class CommandFunction {} // Placeholder class for Debug purposes

const proxyHandlers = {
  set: () => {
    throw new Error('Cannot overwrite the library object')
  }
}

class CommandFunction {
  constructor(commandFunctions, options = {}) {
    autoBind(this)
    const commandsConfig = (this.commandsConfig = {})
    const commandMap = {}
    // TODO: REMOVE THIS ITS SLOW
    Object.entries(commandFunctions).forEach(([commandName, commandConfig]) => {
      const commandOptions = parseCommand(commandConfig, { defaultName: commandName })
      commandMap[commandOptions.name] = commandOptions
    })
    this.options = options
    commandsConfig.commands = commandMap
    commandsConfig.defaultCommand = options.defaultCommand || null
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
    this.exports = {}
  }
  async runCLI(...minimistOptions) {
    const cliArgs = await readCLI(this.commandsConfig, this.commandsOptions, minimistOptions)
    const { commandName, options, primaryArgs = [], format } = cliArgs
    if (cliArgs.hasOwnProperty('format')) {
      sanitize({ ...options, _: primaryArgs }, format)
    }

    let output = this.getExport(commandName)
    //console.log('m', primaryArgs, options)
    if (typeof output == 'function') {
      output = output(...primaryArgs, new Options(options))
    }
    output = await output
    if (output !== undefined) console.log(inspect(output, { colors: true })) // TODO: Make Colors Toggleable
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
    return new Proxy(output, {
      get: (target, prop) => this.getExport(prop),
      ...proxyHandlers
    })
    this.propertyList.forEach(property => {
      this.getExport(property)
    })
    return this.exports
  }
  getExport(name = null) {
    if (name === null && this.defaultCommand) name = this.defaultCommand
    if (typeof name != 'string') throw new Error('Invalid Command Name')

    const searchName = stripString(name)
    //if (this.exports.hasOwnProperty(searchName)) return this.exports[searchName]
    const commandMatch = Object.keys(this.commandsConfig.commands).find(
      commandName => stripString(commandName) === searchName
    )
    const exportMatch = Object.keys(this.staticExports).find(
      exportName => stripString(exportName) === searchName
    )
    const match = commandMatch || exportMatch
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
    this.exports[match] = output
    return output
  }
}

export default CommandFunctions
