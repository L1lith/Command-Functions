const chai = require('chai')
const chaiExec = require('@jsdevtools/chai-exec')
const { expect } = chai

chai.use(chaiExec)

describe('saySomething in CLI', () => {
  it('should return "HELLO WORLD" no arguments', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library1 saySomething')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('HELLO WORLD')
  })
  it('should return "banana" in uppercase', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library1 saySomething banana')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('BANANA')
  })
})
