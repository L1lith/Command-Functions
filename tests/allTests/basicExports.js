const chai = require('chai')
const { assert, expect } = chai
const library = require('../library')
const { details } = require('sandhands')
const { inspect } = require('util')

const exportsFormat = { version: Function, testProp: Number }

describe('the library has the correct exports', () => {
  it('loads the correct exports', async () => {
    expect(inspect(details(library, exportsFormat))).to.equal('null')
  })
})
