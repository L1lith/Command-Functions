const { expect } = require('chai')
const library = require('../../library1')

describe('the library should be frozen', () => {
  it('Cannot be overwritten', () => {
    expect(() => {
      library.multiply = () => {} // Sneaky Attack to put our own malicious code
    }).to.throw()
  })
  it('Cannot have properties deleted', () => {
    expect(() => {
      delete library.multiply // Try to break the library
    }).to.throw()
  })
  it('Cannot have properties redefined', () => {
    expect(() => {
      Object.defineProperty(library, 'multiply', {
        value: 12,
        enumerable: true,
        writable: false,
        configurable: false
      })
    }).to.throw()
  })
})
