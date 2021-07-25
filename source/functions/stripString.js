const stripFluffRegex = /[\-\.\s]+/gi

function stripString(str) {
  if (typeof str != 'string') throw new Error('Expected a string')
  return str.replace(stripFluffRegex, '').toLowerCase()
}

export default stripString
