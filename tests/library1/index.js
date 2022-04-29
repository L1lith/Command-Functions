#!/usr/bin/env node
//const { join } = require('path')
const { CommandFunctions } = require('../../dist/index')
const commands = require('./commands') //join(__dirname, 'commands', 'index.js')
const { version } = require('../../package.json')

const app = new CommandFunctions(commands, {
  exports: {
    testProp: 26,
    version
  }
})

async function run() {
  await app.runCLI()
}

if (require.main === module) {
  run()
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
