const chai = require('chai')
const { assert, expect } = chai
const library = require('../../library')
const { details } = require('sandhands')
const { inspect } = require('util')
const { version } = require('../../../package.json')

const versionExportFormat = { _: String, equalTo: version }

describe('the version command is exported correctly', () => {
  it('loads the version export and has the correct value', async () => {
    expect(inspect(details(library.version, versionExportFormat))).to.equal('null')
  })
})
