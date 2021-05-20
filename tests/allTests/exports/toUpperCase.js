const chai = require('chai')
const { expect } = chai
const library = require('../../library')

describe('the toUpperCase export operates correctly', () => {
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
