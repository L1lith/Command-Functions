const chaiExec = require('@jsdevtools/chai-exec')
const chai = require('chai')
const { expect } = chai

chai.use(chaiExec)

chaiExec.defaults = {
  options: {
    //stdio: 'inherit', // UNCOMMENT TO ENABLE DEBUGGING, breaks the tests though
    cwd: __dirname
  }
}

describe('parseJSON CLI usage', () => {
  it('should function correctly when being used as the default command', () => {
    // Run your CLI
    let myCLI = chaiExec('node ../../library 12')

    // Should syntax
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('12')
    expect(myCLI).stderr.to.be.empty
  })
  it('should correctly parse an object string', () => {
    let myCLI = chaiExec('node ../../library \'{"car": "ford"}\'')

    // Should syntax
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain("{ car: 'ford' }")
    expect(myCLI).stderr.to.be.empty
  })
})
