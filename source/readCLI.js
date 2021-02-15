import minimist from 'minimist'
import readInputObject from './readInputObject'

function readCLI(...args) {
  const rawArgs = minimist(process.argv.slice(2))
  const args = readInputObject(rawArgs, ...args)
}

export default readCLI
