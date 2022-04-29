import { resolveFormat } from 'sandhands'
import stripString from './stripString'

const truthy = ['yes', 'true', 'y']
const falsy = ['false', 'no', 'n']

function autoNormalize(value, formatDetails) {
  // Automatically helps us format our inputs correctly
  const { format, options } = formatDetails
  if (format === Boolean && typeof value == 'string') {
    if (typeof value == 'string') {
      const newValue = stripString(value)
      if (truthy.includes(newValue)) return true
      if (falsy.includes(newValue)) return false
    }
  } else if (format === String && typeof value == 'string') {
    if (options.lowercase === true) value = value.toLowerCase()
    if (options.trimmed === true) value = value.trim()
    if (options.uppercase === true) value = value.toUpperCase()
  } else if (format === Number) {
    const newValue = parseFloat(value)
    if (isFinite(newValue)) value = newValue
    if (options.hasOwnProperty('min')) {
      value = Math.max(options.min, value)
    }
    if (options.hasOwnProperty('max')) {
      value = Math.min(options.max, value)
    }
  }
  return value
}

export default autoNormalize
