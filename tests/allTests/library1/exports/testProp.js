const chai = require('chai')
const { expect } = chai
const library = require('../../../library1')

describe('the testProp is exported correctly', () => {
  it('the testProp export returns the correct value', () => {
    expect(library.testProp).to.equal(26)
  })
})
