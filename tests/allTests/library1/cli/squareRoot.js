const chai = require('chai')
const chaiExec = require('@jsdevtools/chai-exec')
const { expect } = chai
const { version } = require('../../../../package.json')

chai.use(chaiExec)

describe('SquareRoot in CLI', () => {
  it('should exit with a one exit code with no arguments', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library1 squareRoot')
    expect(myCLI).to.exit.with.code(1)
  })
  it('should correctly get the square root of 25', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library1 squareRoot 25')

    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('5')
  })
})
