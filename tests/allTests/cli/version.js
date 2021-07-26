const chai = require('chai')
const chaiExec = require('@jsdevtools/chai-exec')
const { expect } = chai
const { version } = require('../../../package.json')

chai.use(chaiExec)

describe('Version Export in CLI', () => {
  var myCLI
  before(() => {
    myCLI = chaiExec('node tests/library version')
  })
  it('should exit with a zero exit code', () => {
    // Run your CLI
    // Expect sytnax
    expect(myCLI).to.exit.with.code(0)
  })
  it('should return the correct version', () => {
    expect(myCLI).stdout.to.contain(version)
  })
})
