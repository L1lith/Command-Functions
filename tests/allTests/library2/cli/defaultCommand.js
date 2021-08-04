const chai = require('chai')
const chaiExec = require('@jsdevtools/chai-exec')
const { expect } = chai

chai.use(chaiExec)

describe('The default command should function properly in CLI', () => {
  it('should return the output of the nothing command', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library2')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('nothing')
  })
})
