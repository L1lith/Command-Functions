const chai = require('chai')
const chaiExec = require('@jsdevtools/chai-exec')
const { expect } = chai

chai.use(chaiExec)

describe('the getTime export', () => {
  it('should return the time', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library3/getTime')
    expect(myCLI).to.exit.with.code(0)
  })
})
