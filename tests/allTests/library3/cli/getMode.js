const chai = require('chai')
const chaiExec = require('@jsdevtools/chai-exec')
const { expect } = chai
const strip = require('strip-color')

chai.use(chaiExec)
chai.use(require('chai-match'))
const cliStringRegex = /cli/

describe('the getMode command in CLI', () => {
  it('should return the current mode', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library3/getMode')
    expect(myCLI).to.exit.with.code(0)
    expect(strip(myCLI.stdout)).to.match(cliStringRegex)
  })
})
