const chai = require('chai')
const chaiExec = require('@jsdevtools/chai-exec')
const { expect } = chai
const { join } = require('path')

chai.use(chaiExec)

describe('multiply in CLI', () => {
  it('should multiply 2 and 7', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library1 multiply 2 7')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('14')
  })
  it('should work with aliases', () => {
    const myCLI = chaiExec('node tests/library1 product 5 6')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('30')
  })
  it('should support colors by default', () => {
    const myCLI = chaiExec('node tests/library1 product 5 6')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.equal('\x1B[33m30\x1B[39m\n')
  })
  it('should support disabling colors', () => {
    const myCLI = chaiExec('node tests/library1 product 5 6 --noColors')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.equal('30\n')
  })
  it('should throw with no arguments', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library1 multiply')
    expect(myCLI).to.exit.with.code(1)
    expect(myCLI).stderr.to.contain('Must supply at least 2 numbers')
  })
  it('should throw with 1 argument', () => {
    // Run your CLI
    const myCLI = chaiExec('node tests/library1 multiply 1')
    expect(myCLI).to.exit.with.code(1)
    expect(myCLI).stderr.to.contain('Must supply at least 2 numbers')
  })
  it('should function properly when installed as a command-line executable', () => {
    // Note: must run "npm link ." before this test will pass

    const myCLI = chaiExec('command-templates-test-library multiply 25 10', {
      //cwd: join(__dirname, '../../../../'),
      //stdio: 'inherit'
    })
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('250')
  })
  it('should list the aliases in the help command', () => {
    const myCLI = chaiExec('node tests/library1 help multiply')
    expect(myCLI).to.exit.with.code(0)
    expect(myCLI).stdout.to.contain('aliases:')
    expect(myCLI).stdout.to.contain('product')
  })
})
