import { resolveFormat } from 'sandhands'
import stripString from './stripString'

const truthy = ['yes', 'true', 'y']
const falsy = ['false', 'no', 'n']

function autoNormalize(value, rawFormat) {
  // Automatically helps us format our inputs correctly
  const { format, options } = resolveFormat(rawFormat)
  if (format === Boolean) {
    value = stripString(value)
    if (truthy.includes(value)) return true
    if (falsy.includes(value)) return false
  } else if (format === String) {
    if (options.lowercase === true) value = value.toLowerCase()
    if (options.trimmed === true) value = value.trim()
    if (options.uppercase === true) value = value.toUpperCase()
  } else if (format === Number) {
    return parseFloat(value)
  }
  return value
}

export default autoNormalize
