const chai = require('chai')
const chaiExec = require('@jsdevtools/chai-exec')
const { expect } = chai
const strip = require('strip-color')

chai.use(chaiExec)
chai.use(require('chai-match'))
const dateStringRegex = /[0-9]+\-[0-9]+\-[0-9]+T[0-9]+\:[0-9]+\:[0-9]+\.[0-9a-zA-Z]+/

const defaultFruit = ['tomato', 'banana', 'grape']

describe('the getTime command', () => {
  it('should return the current time', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library3/getTime')
    expect(myCLI).to.exit.with.code(0)
    expect(strip(myCLI.stdout)).to.match(dateStringRegex)
  })
})
