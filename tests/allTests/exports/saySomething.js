const chai = require('chai')
const { expect } = chai
const library = require('../../library')

describe('the saySomething function is exported correctly', () => {
  it('the saySomething function returns the correct value', () => {
    expect(library.saySomething()).to.equal('hello world') // Uses the default value
    expect(library.saySomething('hi there')).to.equal('hi there')
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
