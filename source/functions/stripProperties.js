function stripProperties(object, properties = [], removeFromOriginal = true) {
  if (typeof object != 'object' || object === null) throw new Error('Must supply an object')
  if (
    !Array.isArray(properties) ||
    properties.length < 1 ||
    properties.some(property => typeof property != 'string')
  )
    throw new Error('Properties must be an array of strings')
  const output = {}
  properties.forEach(property => {
    if (object.hasOwnProperty(property)) output[property] = object[property]
    if (removeFromOriginal === true) delete object[property]
  })
  return output
}

export default stripProperties
