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
import chalk from 'chalk'
import displayList from './displayList'
import util from 'util'
import stringifySandhandsFormat from './stringifySandhandsFormat'

const proxyHandlers = {}
proxyHandlers.set =
  proxyHandlers.deleteProperty =
  proxyHandlers.defineProperty =
    () => {
      throw new Error('Cannot overwrite the library object')
    }

class CommandFunctions {
  constructor(commandFunctions = {}, options = {}) {
    autoBind(this)
    const commandsConfig = (this.commandsConfig = {})
    const commandMap = {}
    const aliasMap = (this.aliasMap = {})
    if (typeof commandFunctions !== 'object' || commandFunctions === null)
      throw new Error('Must supply a commandFunctions object')
    commandFunctions = { ...commandFunctions }
    if (!commandFunctions.hasOwnProperty('help'))
      commandFunctions.help = {
        handler: this.helpCommand,
        spreadArgs: true,
        args: {
          command: {
            format: { _: String, nullable: true },
            argsPosition: 0,
            default: null
          }
        }
      }
    Object.entries(commandFunctions).forEach(([commandName, commandConfig]) => {
      const commandOptions = parseCommand(commandConfig, { defaultName: commandName })
      const { name } = commandOptions
      const strippedName = stripString(name)
      commandMap[name] = commandOptions
      if (strippedName !== name) aliasMap[strippedName] = name
      if (commandOptions.options.hasOwnProperty('aliases'))
        commandOptions.options.aliases.forEach(alias => {
          aliasMap[alias] = name
        })
    })
    this.options = options
    commandsConfig.commands = commandMap
    commandsConfig.defaultCommand = options.defaultCommand || null
    this.staticExports = {}
    if (typeof options.exports == 'object' && options.exports !== null) {
      Object.entries(options.exports).forEach(([key, value]) => {
        const strippedName = stripString(key)
        if (strippedName !== key) aliasMap[strippedName] = key
        this.staticExports[key] = value
      })
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
    this.exports.__proto__.valueOf = this.getFlushedExports()
  }
  async runCLI(...minimistOptions) {
    const cliArgs = await readCLI(this.commandsConfig, this.commandsOptions, minimistOptions)
    const { commandName, options, primaryArgs = [], format, libraryOptions } = cliArgs
    const { noColors = false } = libraryOptions
    if (cliArgs.hasOwnProperty('format')) {
      sanitize({ ...options, _: primaryArgs }, format)
    }

    let output = this.getExport(commandName)
    //console.log('m', primaryArgs, options)
    if (typeof output == 'function') {
      output = output(...primaryArgs, new Options(options))
    }
    output = await output
    if (output !== undefined) console.log(util.inspect(output, { colors: !noColors })) // TODO: Make Colors Toggleable
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
  getFlushedExports() {
    this.propertyList.forEach(prop => this.getExport(prop))
    return this.getExports()
  }
  getExports() {
    const proxyProtocol = {
      ownKeys: this.getKeys,
      enumerate: this.getKeys,
      get: (target, prop) => {
        this.getExport(prop)
        return Reflect.get(target, prop)
      },
      has: (target, prop) => {
        const { type, match } = this.findProp(prop)
        return match !== null
      },
      getOwnPropertyDescriptor: (target, prop) => {
        if (this.findProp(prop).match !== null) {
          // called for every property
          return {
            value: this.getExport(prop),
            enumerable: true,
            configurable: false,
            writable: false
            /* ...other flags, probable "value:..." */
          }
        } else {
          //return { enumerable: false, configurable: false }
        }
      },
      ...proxyHandlers
    }
    return new Proxy(this.exports, proxyProtocol)
  }
  getKeys() {
    //console.log('x', this.propertyList)
    return this.propertyList
  }
  findProp(name = null) {
    if (name === null && this.defaultCommand) name = this.defaultCommand
    if (typeof name != 'string') throw new Error('Invalid Command Name')

    let searchName = stripString(name)
    if (this.aliasMap.hasOwnProperty(searchName)) {
      searchName = this.aliasMap[searchName]
    }
    //if (this.exports.hasOwnProperty(searchName)) return this.exports[searchName]
    let commandMatch = Object.keys(this.commandsConfig.commands).find(
      commandName => commandName === searchName
    )
    const exportMatch = Object.keys(this.staticExports).find(
      exportName => exportName === searchName
    )
    if (commandMatch && exportMatch) {
      throw new Error('Found duplicate exports for ' + name)
    }
    return {
      type: commandMatch ? 'command' : exportMatch ? 'export' : 'none',
      match: commandMatch || exportMatch || null
    }
  }
  getExport(name) {
    const { match, type } = this.findProp(name)
    let output
    if (type === 'command') {
      const commandConfig = this.commandsConfig.commands[match]
      output = createCommandHandler(commandConfig)
    } else if (type === 'export') {
      output = this.staticExports[match]
    } else {
      throw new Error(`Missing the export "${name}", try the help command`)
    }
    if (this.exports.hasOwnProperty(match)) return this.exports[match]
    Object.defineProperty(this.exports, match, {
      value: output,
      enumerable: true,
      configurable: false,
      writable: false
    })

    return output
  }
  helpCommand(commandName, options) {
    if (commandName === null) {
      // Get the list of commands and exports
      console.log(
        chalk.yellow('To get help about a command, try:\n') +
          chalk.green('help ' + chalk.bold('{command}'))
      )
      displayList(Object.keys(this.commandsConfig.commands).sort(), 'Commands')
    } else {
      // Get info about a specific command or export
      const { match, type } = this.findProp(commandName)
      if (type === 'command') {
        const config = this.commandsConfig.commands[match]
        const { name, options } = config
        const { args = {}, description } = options
        console.log(chalk.green('Command: ' + chalk.cyan(name)))
        if (options.hasOwnProperty('description')) console.log(chalk.yellow(description))
        if (options.hasOwnProperty('aliases')) {
          console.log(
            chalk.green('aliases: ') + chalk.white(options.aliases.map(alias => alias).join(', '))
          )
        }
        displayList(
          Object.keys(args)
            .sort()
            .map(arg => {
              const optionConfig = args[arg] || {}
              return (
                arg +
                (optionConfig.hasOwnProperty('format')
                  ? chalk.reset('\n |- format: ') + stringifySandhandsFormat(optionConfig.format)
                  : '')
              )
            }),
          chalk.green('Args')
        )
        if (options?.mode === 'node') return config
      } else if (type === 'export') {
        throw new Error('Cannot get info about an export')
      } else {
        throw new Error(`Could not find the export or command "${commandName}"`)
      }
    }
  }
}

export default CommandFunctions
