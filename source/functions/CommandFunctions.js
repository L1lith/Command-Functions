import parseCommand from './parseCommand'
import getExports from './getExports'
import readCLI from './readCLI'
import stripProperties from './stripProperties'
import { sanitize } from 'sandhands'
import { inspect } from 'util'

class CommandFunctions {
  constructor(commandFunctions = null, options = {}) {
    const commandsConfig = (this.commandsConfig = {})
    const commandMap = {}
    let defaultCommand = null
    Object.entries(commandFunctions).forEach(([commandName, commandConfig]) => {
      const commandOptions = parseCommand(commandConfig, { defaultName: commandName })
      commandMap[commandOptions.name] = commandOptions
      if (commandOptions.default === true) {
        if (defaultCommand !== null) throw new Error('Found multiple default commands')
        defaultCommand = commandOptions.name
      }
    })
    commandsConfig.commandMap = commandMap
    commandsConfig.defaultCommand = defaultCommand || null
    this.options = options
    this.commandsOptions = stripProperties(this.options, ['default'], true)
    //this.getExports = this.getExports.bind(this)
    this.runCLI = this.runCLI.bind(this)
    this.autoRun = this.autoRun.bind(this)
    this._exports = null
  }
  get exports() {
    if (this._exports !== null) return this._exports
    let newExports = getExports(this.commandsConfig, this.commandsOptions)
    if (typeof this.options.exports == 'object' && this.options.exports !== null) {
      newExports = { ...this.options.exports, ...newExports }
    }
    return (this._exports = newExports)
  }
  async runCLI(...minimistOptions) {
    const cliArgs = await readCLI(this.commandsConfig, this.commandsOptions, minimistOptions)
    const exports = this.exports
    const { name, options, primaryArgs = [], format } = cliArgs
    if (!exports.hasOwnProperty(name)) throw new Error('Missing the export for the command ' + name)
    // if (cliArgs.hasOwnProperty('format')) {
    //   sanitize({ ...options, _: primaryArgs }, format)
    // }
    let output
    if (typeof options == 'object' && options !== null) {
      output = await exports[name](...primaryArgs, options)
    } else {
      output = await exports[name](...primaryArgs)
    }
    return output
  }
  autoRun(doExit = true) {
    const isParentShell = require.main === module.parent
    if (isParentShell) {
      this.runCLI()
        .then(output => {
          if (output !== undefined) console.log(inspect(output))
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
      return this.exports
    }
  }
}

export default CommandFunctions
