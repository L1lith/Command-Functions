function toUpperCase(str) {
  return str.toUpperCase()
}

module.exports = {
  inputs: {
    _: { format: { _: [String], length: 1 } }
  },
  handler: toUpperCase
}
