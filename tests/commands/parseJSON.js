function parseJSON(str) {
  return JSON.parse(str)
}

module.exports = {
  inputs: { _: { normalize: inputs => String(inputs[0]) } },
  handler: parseJSON
}
