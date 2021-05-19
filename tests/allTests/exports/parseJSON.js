const chai = require('chai')
const { assert, expect } = chai
const library = require('../../library')

describe('the parseJSON command operates correctly', () => {
  const { parseJSON } = library
  it('Parses valid JSON correctly', () => {
    const dataStructure = { a: 2, gh: '0z' }
    const dataString = JSON.stringify(dataStructure)
    expect(parseJSON(dataString)).to.deep.equal(dataStructure)
  })
  it('Deconstructs and reparses non-string values', () => {
    ;[1, 2, 3, true].forEach(value => {
      expect(parseJSON(value)).to.deep.equal(value)
    })
  })
  it('Fails to re-encode invalid JSON values', () => {
    expect(() => {
      parseJSON(NaN)
    }).to.throw()
  })
})
