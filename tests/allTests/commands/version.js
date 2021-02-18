const chai = require('chai')
const { assert, expect } = chai
const library = require('../../library')
const { details } = require('sandhands')
const { inspect } = require('util')
const { version } = require('../../../package.json')

const versionExportFormat = { _: { version: Function }, strict: false }

describe('the version command is exported correctly', () => {
  it('loads the version export', async () => {
    expect(inspect(details(library, versionExportFormat))).to.equal('null')
  })
  it('the version function returns the correct value', async () => {
    expect(library.version()).to.equal(version)
  })
})
