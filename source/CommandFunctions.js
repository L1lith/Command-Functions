import ParsedCommandOptions from './CommandFunction/ParsedCommandOptions'
import readCLI from './functions/readCLI'
import stripProperties from './functions/stripProperties'
import { sanitize } from 'sandhands'
import { inspect } from 'util'
import onlyUnique from './functions/onlyUnique'
import stripString from './functions/stripString'
import CommandFunction from './CommandFunction'
import Options from './Options'
import autoBind from 'auto-bind'
import chalk from 'chalk'
import displayList from './functions/displayList'
import util from 'util'
import stringifySandhandsFormat from './functions/stringifySandhandsFormat'

const proxyHandlers = {}
proxyHandlers.set =
  proxyHandlers.deleteProperty =
  proxyHandlers.defineProperty =
    () => {
      throw new Error('Cannot overwrite the library object')
    }

const defaultExports = {
  Options
}

class CommandFunctions {
  constructor(commandFunctions = {}, options = {}) {
    autoBind(this)
    const commandsConfig = (this.commandsConfig = {})
    const commandMap = {}
    const aliasMap = (this.aliasMap = {})
    if (typeof commandFunctions !== 'object' || commandFunctions === null)
      throw new Error('Must supply an object to be the map of command functions')
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
      const commandOptions = new ParsedCommandOptions(commandConfig, { defaultName: commandName })
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
    commandsConfig.defaultCommand =
      options.defaultCommand || commandMap.hasOwnProperty('help') ? 'help' : null
    this.staticExports = {}
    if (typeof options.exports == 'object' && options.exports !== null) {
      Object.entries(options.exports)
        .concat(Object.entries(defaultExports))
        .forEach(([key, value]) => {
          const strippedName = stripString(key)
          if (strippedName !== key) aliasMap[strippedName] = key
          this.staticExports[key] = value
        })
    }
    this.propertyList = Object.keys(this.commandsConfig.commands)
      .concat(Object.keys(this.staticExports))
      .filter(onlyUnique)
    this.options = options
    this.commandHandlers = {}
    this.commandsOptions = stripProperties(this.options, ['defaultCommand'], true)
    this.exports = {}
    //this.exports.__proto__.valueOf = this.getFlushedExports()
  }
  async runCLI(args = null) {
    // const matchingProp = Array.isArray(args) && args.length > 0 ? this.findProp(args[0]) : null
    // const tempCommandName = matchingProp
    //   ? matchingProp.match
    //   : this.commandsOptions.defaultCommand || null
    // if (!tempCommandName) throw new Error('Could not find the matching command.')
    const cliArgs = await readCLI(args, this.commandsOptions)
    const { commandName, options, primaryArgs = [], format, libraryOptions } = cliArgs
    const { noColors = false, silent = false } = libraryOptions
    let oldLog
    if (cliArgs.hasOwnProperty('format')) {
      sanitize({ ...options, _: primaryArgs }, format)
    }
    if (silent === true) {
      oldLog = console.log
      console.log = () => {} // Do Nothing
    }
    let output = this.getExport(commandName, { mode: 'cli' })
    if (typeof output == 'function') {
      output = output(...primaryArgs, new Options(options))
    }
    output = await output
    if (output !== undefined) console.log(util.inspect(output, { colors: !noColors })) // TODO: Make Colors Toggleable
    if (silent === true) {
      console.log = oldLog // Fix the logging
    }
    return output
  }
  autoRun(doExit = true) {
    console.warn('The autoRun method is deprecated, it may not work correctly.')
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
    if (name === null && this.commandsConfig.defaultCommand)
      name = this.commandsConfig.defaultCommand
    if (typeof name != 'string') throw new Error('Invalid Command Name')

    let searchName = stripString(name)
    // if (searchName === 'testprop') {
    //   console.log(searchName, this.aliasMap, this.staticExports)
    // }
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
    //console.log(name, exportMatch)
    if (commandMatch && exportMatch) {
      throw new Error('Found duplicate exports for ' + name)
    }
    return {
      type: commandMatch ? 'command' : exportMatch ? 'export' : 'none',
      match: commandMatch || exportMatch || null
    }
  }
  getExport(name, options = {}) {
    const { mode } = options
    const { match, type } = this.findProp(name)
    //console.log('z', name, mode, type)
    let output
    if (type === 'command') {
      const commandConfig = this.commandsConfig.commands[match]
      let handler
      if (!this.commandHandlers.hasOwnProperty(match)) {
        handler = this.commandHandlers[match] = new CommandFunction(commandConfig, { mode })
      } else {
        handler = this.commandHandlers[match]
      }
      output = handler.execute
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
