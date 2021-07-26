const chai = require('chai')
const chaiExec = require('@jsdevtools/chai-exec')
const { expect } = chai
const { version } = require('../../../package.json')

chai.use(chaiExec)

describe('SquareRoot in CLI', () => {
  it('should return "HELLO WORLD" no arguments', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library saySomething')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('HELLO WORLD')
  })
  it('should return "banana" in uppercase', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library saySomething banana')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('BANANA')
  })
})
