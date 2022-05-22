const chai = require('chai')
const { expect } = chai

describe('the getTime function is exported correctly', () => {
  let getTime = null
  it('can load the getTime function', () => {
    getTime = require('../../../library3/getTime')
    expect(getTime).to.be.a('function')
  })
  it('the getTime function returns a date', () => {
    const time = getTime()
    expect(time).to.be.a('date')
  })
})
