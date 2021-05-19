function parseJSON(str, options = {}) {
  const { surpriseThrow = false } = options
  if (surpriseThrow === true) throw new Error('Surprise throw requested')
  return JSON.parse(str)
}

module.exports = {
  inputs: { _: { normalize: inputs => String(inputs[0]) }, surpriseThrow: { format: Boolean } },
  handler: parseJSON
}
