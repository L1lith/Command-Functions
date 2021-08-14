const chai = require('chai')
const { expect } = chai
const getTime = require('../../library3/getTime')

describe('the getTime function can run as a standalone CommandFunction', () => {
  it('the getTime function returns the correct value', () => {
    expect(getTime).to.be.a('function')
    expect(getTime()).within(
      new Date(Date.now() - 1000 * 60 * 5),
      new Date()
    ) /* Between 5 minutes ago and now */
  })
})
