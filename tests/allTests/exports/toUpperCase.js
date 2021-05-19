const chai = require('chai')
const { assert, expect } = chai
const library = require('../../library')
// const { details } = require('sandhands')
// const { inspect } = require('util')
// const { version } = require('../../../package.json')

const versionExportFormat = {
  _: {
    version: { _: String, regex: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/ /* Semver Regex */ }
  },
  strict: false
}

describe('the toUpperCase command operates correctly', () => {
  const { toUpperCase } = library
  it('Accepts valid inputs', () => {
    expect(toUpperCase('banana boat')).to.equal('BANANA BOAT')
  })
  it('Prevents invalid inputs', () => {
    expect(() => {
      toUpperCase('a', 'b') // Multiple Inputs
    }).to.throw()
    expect(() => {
      toUpperCase(1) // Non-String
    }).to.throw()
  })
})
