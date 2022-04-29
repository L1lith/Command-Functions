import parseCommand from './parseCommand'

class ParsedCommandOptions {
  constructor(...args) {
    //if (typeof params != 'object' || params !== null)
    //  throw new Error('Expected a parameters object')
    Object.assign(this, parseCommand(...args))
  }
}

export default ParsedCommandOptions
