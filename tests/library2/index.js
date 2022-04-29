#!/usr/bin/env node

const { CommandFunctions } = require('../../dist/index')
const commands = require('./commands')

const app = new CommandFunctions(commands, {
  defaultCommand: 'sayNothing'
})

//module.exports = app.autoRun()

if (require.main === module) {
  app
    .runCLI()
    .then(() => {
      process.exit(0)
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
} else {
  module.exports = app.getExports()
}
