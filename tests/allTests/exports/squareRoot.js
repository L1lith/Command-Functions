const chai = require('chai')
const { expect } = chai
const library = require('../../library')

describe('the squareRoot function is exported correctly', () => {
  it('the squareRoot function returns the correct value', () => {
    expect(library.squareRoot(16)).to.equal(4)
    expect(library.squareRoot(9)).to.equal(3)
    expect(library.squareRoot(4)).to.equal(2)
  })
})
