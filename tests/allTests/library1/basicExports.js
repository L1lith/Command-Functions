const chai = require('chai')
const { assert, expect } = chai
const library = require('../../library1')
const { details } = require('sandhands')
const { inspect } = require('util')

const exportsFormat = {
  version: String,
  testProp: Number,
  squareRoot: Function,
  saySomething: Function,
  multiply: Function,
  help: Function,
  Options: Function
}

describe('the library has the correct exports', () => {
  it('loads the correct exports', async () => {
    expect(inspect(details(library, exportsFormat))).to.equal('null')
  })
})
