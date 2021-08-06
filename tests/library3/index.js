const { loadCommandsFolder, CommandFunctions } = require('../../dist/command-functions')
const { join } = require('path')

async function run() {
  const commands = await loadCommandsFolder(join(__dirname, 'commands'))
  const app = new CommandFunctions(commands)
  return app.autoRun()
}

module.exports = run().catch(err => {
  console.error(err)
  process.exit(1)
})
