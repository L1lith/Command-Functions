import { resolveFormat, valid } from 'sandhands'
import stripString from './stripString'
import { default as promptSync } from 'prompt-sync'
import autoComplete from './autoComplete'

const prompt = promptSync()

function argPrompt(question, argConfig) {
  const options = {}
  let formatDetails = null
  if (argConfig.hasOwnProperty('format')) {
    formatDetails = resolveFormat(argConfig.format)
    const autoComplete = getAutoComplete(formatDetails)
    if (autoComplete) {
      options.autocomplete = autoComplete
    }
  }
  console.log(question)
  let response = prompt('> ', options)
  if (formatDetails !== null) {
    response = autoNormalize(response, formatDetails)
  }
  return response
}

function getAutoComplete(formatDetails, extraOptions = []) {
  const { format } = formatDetails
  if (format === Boolean) return autoComplete(['yes', 'no'].concat(extraOptions))
}

const truthy = ['yes', 'true', 'y']
const falsy = ['false', 'no', 'n']

function autoNormalize(value, formatDetails) {
  // Automatically helps us format our inputs correctly
  const { format, options } = formatDetails
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

// function askQuestion(question, options = {}) {
//   const { validAnswers = null, trimAnswer = true, lowercase = false } = options
//   if (
//     validAnswers !== null &&
//     (!Array.isArray(validAnswers) ||
//       validAnswers.length < 1 ||
//       validAnswers.some(value => typeof value != 'string'))
//   )
//     throw new Error('Valid answers must be an array of at least 1 string')
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     terminal: false
//   })
//   return new Promise((resolve, reject) => {
//     if (typeof question != 'string' || question.length < 1)
//       reject(new Error('Must supply a question'))
//     rl.question(question, answer => {
//       // TODO: Log the answer in a database
//       if (trimAnswer === true) answer = answer.trim()
//       if (lowercase === true) answer = answer.toLowerCase()
//       if (validAnswers !== null && !validAnswers.includes(answer))
//         return reject(
//           new Error('Invalid Answer, expected one of the following: ' + validAnswers.join(', '))
//         )
//       resolve(answer)
//       rl.close()
//     })
//   })
// }

export default argPrompt
