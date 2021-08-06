const { CommandFunctions } = require('../../dist/command-functions')
const commands = require('./commands')

const app = new CommandFunctions(commands, {
  defaultCommand: 'sayNothing'
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
