const chai = require('chai')
const { assert, expect } = chai
const library = require('../../library')
const { details } = require('sandhands')
const { inspect } = require('util')
const { version } = require('../../../package.json')

const versionExportFormat = {
  _: {
    version: { _: String, regex: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/ /* Semver Regex */ }
  },
  strict: false
}

describe('the version command is exported correctly', () => {
  it('loads the version export and has the correct value', async () => {
    expect(inspect(details(library, versionExportFormat))).to.equal('null')
  })
})
