const chaiExec = require('@jsdevtools/chai-exec')
const chai = require('chai')
const { expect } = chai

chai.use(chaiExec)

describe('parseJSON CLI usage', () => {
  it('should exit with a zero exit code', () => {
    // Run your CLI
    let myCLI = chaiExec('node ../../library 12')

    // Should syntax
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('Success!')
    expect(myCLI).stderr.to.be.empty
  })
})
