const { CommandFunctions } = require('./dist/Shinput-commonjs')
const commands = require('./commands')

const app = new CommandFunctions(commands, {
  exports: {
    age: 12
  }
})

async function run() {
  console.log(await app.runCLI())
}

if (require.main === module) {
  run()
    .then(() => {
      console.log('Finished')
      process.exit(0)
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
} else {
  module.exports = app.getExports()
}
