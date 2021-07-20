const { CommandFunctions } = require('../dist/Shinput-commonjs')
const commands = require('./commands')
const { version } = require('../package.json')

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
