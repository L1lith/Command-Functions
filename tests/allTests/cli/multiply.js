const chai = require('chai')
const chaiExec = require('@jsdevtools/chai-exec')
const { expect } = chai

chai.use(chaiExec)

describe('multiply in CLI', () => {
  it('should multiply 2 and 7', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library multiply 2 7')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('14')
  })
  it('should throw with no arguments', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library multiply')
    expect(myCLI).to.exit.with.code(1)
    expect(myCLI).stderr.to.contain('Must supply at least 2 numbers')
  })
  it('should throw with 1 argument', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library multiply 1')
    expect(myCLI).to.exit.with.code(1)
    expect(myCLI).stderr.to.contain('Must supply at least 2 numbers')
  })
})
