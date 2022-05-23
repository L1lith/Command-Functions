const chai = require('chai')
const { expect } = chai

describe('the getMode function is exported correctly', () => {
  let getMode = null
  it('can load the getTime function', () => {
    getMode = require('../../../library3/getMode')
    expect(getMode).to.be.a('function')
  })
  it('the getTime function returns a date', () => {
    const mode = getMode()
    expect(mode).to.equal('node')
  })
})
