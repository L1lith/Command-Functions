const chai = require('chai')
const chaiExec = require('@jsdevtools/chai-exec')
const { expect } = chai

chai.use(chaiExec)

describe('the help command', () => {
  it('should print a list of commands', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library1 help')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('Commands')
    expect(myCLI).stdout.to.contain('multiply')
    expect(myCLI).stdout.to.contain('saySomething')
    expect(myCLI).stdout.to.contain('squareRoot')
  })
  it('should be the default command', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library1')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('Commands')
  })
  it('should give accurate info about the saySomething command', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library1 help saySomething')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('Command: saySomething')
    expect(myCLI).stdout.to.contain('Says a thing or whatever')
    expect(myCLI).stdout.to.contain('Args')
    expect(myCLI).stdout.to.contain('message')
    expect(myCLI).stdout.to.contain('format:')
  })
})
