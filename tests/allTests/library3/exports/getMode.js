const chai = require('chai')
const { expect } = chai

describe('the getMode function is exported correctly', () => {
  let getMode = null
  it('can load the getMode function', () => {
    getMode = require('../../../library3/getMode')
    expect(getMode).to.be.a('function')
  })
  it('the getMode function returns node', () => {
    const mode = getMode()
    expect(mode).to.equal('node')
  })
})
