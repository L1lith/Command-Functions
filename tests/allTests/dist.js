const chai = require('chai')
const { assert, expect } = chai
const library = require('../../dist')
const { details } = require('sandhands')
const { inspect } = require('util')

const exportsFormat = {
  CommandFunctions: Function,
  argPrompt: Function,
  default: Function,
  CommandFunction: Function,
  Options: Function
}

describe('the command-functions library has the correct exports', () => {
  it('loads the correct exports', async () => {
    expect(inspect(details(library, exportsFormat))).to.equal('null')
  })
})
