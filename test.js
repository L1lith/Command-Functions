const { CommandFunctions } = require('./dist/Shinput-commonjs')

const app = new CommandFunctions({
  version: (...args) => {
    console.log(...args)
  }
})

module.exports = app.autoRun()
