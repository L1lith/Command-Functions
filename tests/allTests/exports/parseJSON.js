const chai = require('chai')
const { expect } = chai
const library = require('../../library')

describe('the parseJSON export operates correctly', () => {
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
  it('Receives the surpriseThrow option successfully', () => {
    expect(() => {
      parseJSON(12)
    }).to.not.throw()
    expect(() => {
      parseJSON(12, { surpriseThrow: true })
    }).to.throw()
  })
})
