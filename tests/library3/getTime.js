#!/usr/bin/env node

const CommandFunction = require('../../dist/CommandFunction')

function getTime() {
  return new Date()
}

const command = new CommandFunction(getTime)

//module.exports = command.autoRun()
async function run() {
  await command.runCLI(process.argv)
  //console.log('p', )
}

const isParentShell = require.main === module
if (isParentShell) {
  run()
    .then(() => {
      process.exit(0)
    })
    .catch(error => {
      console.error(error)
      if (doExit === true) {
        process.exit(1)
      }
    })
} else {
  return this.execute
}
