#!/usr/bin/env node

const CommandFunction = require('../../dist/CommandFunction')

function getMode(options) {
  return options.mode
}

const command = new CommandFunction(getMode)

//module.exports = command.autoRun()
async function run() {
  await command.runCLI(process.argv)
}

const isParentShell = require.main === module
if (isParentShell) {
  run()
    .then(() => {
      process.exit(0)
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
} else {
  module.exports = command.execute
}
