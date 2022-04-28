#!/usr/bin/env node
//const { join } = require('path')
const { CommandFunctions } = require('../../dist/command-functions')
const commands = require('./commands') //join(__dirname, 'commands', 'index.js')
const { version } = require('../../package.json')

const app = new CommandFunctions(commands, {
  exports: {
    testProp: 26,
    version
  }
})

module.exports = app.autoRun()
// async function run() {
//   await app.runCLI()
// }

// if (require.main === module) {
//   run()
//     .then(() => {
//       console.log('Finished')
//       process.exit(0)
//     })
//     .catch(error => {
//       console.error(error)
//       process.exit(1)
//     })
// } else {
//   module.exports = app.getExports()
// }
