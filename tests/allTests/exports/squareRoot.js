const chai = require('chai')
const { expect } = chai
const library = require('../../library')

describe('the squareRoot function is exported correctly', () => {
  it('the squareRoot function returns the correct value', () => {
    expect(library.squareRoot(16)).to.equal(4)
    expect(library.squareRoot(9)).to.equal(3)
    expect(library.squareRoot(4)).to.equal(2)
  })
  it('throws with invalid args', () => {
    expect(() => {
      library.squareRoot() // Must supply a number
    }).to.throw()
    expect(() => {
      library.squareRoot(2, 2) // Multiple args not allowed
    }).to.throw()
    expect(() => {
      library.squareRoot('ten') // Should only allow numbers not strings
    }).to.throw()
  })
})
