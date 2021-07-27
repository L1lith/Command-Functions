const chai = require('chai')
const { expect } = chai
const library = require('../../library')

describe('the multiply function is exported correctly', () => {
  it('the multiply function returns the correct value', () => {
    expect(library.multiply(4, -3)).to.equal(-12)
    expect(library.multiply(9, 2)).to.equal(18)
    expect(library.multiply(4, 5)).to.equal(20)
  })
  it('throws with invalid args', () => {
    expect(() => {
      library.multiply() // Must supply a number
    }).to.throw()
  })
})
