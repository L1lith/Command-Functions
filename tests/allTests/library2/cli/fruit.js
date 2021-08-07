const chai = require('chai')
const chaiExec = require('@jsdevtools/chai-exec')
const { expect } = chai

chai.use(chaiExec)

const defaultFruit = ['tomato', 'banana', 'grape']

describe('the fruit command', () => {
  it('should return a random fruit without any args', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library2 fruit')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.satisfy(output => defaultFruit.some(fruit => output.includes(fruit)))
  })
  it('should throw with 2 arguments', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library2 fruit banana grape')
    expect(myCLI).to.exit.with.code(1)
    expect(myCLI).stderr.to.contain('Received too many primary arguments')
  })
  it('should return the requested fruit', () => {
    const myCLI = chaiExec('node tests/library2 fruit orange')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('orange')
  })
})
