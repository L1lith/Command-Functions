const optionsFormat = {}

function readInputObject(options = null) {
  if (options !== null) sanitize(options, optionsFormat)
}

export default readInputObject
