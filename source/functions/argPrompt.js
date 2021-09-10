import { resolveFormat, reconstructFormat, sanitize, valid } from 'sandhands'
import { default as promptSync } from 'prompt-sync'
import autoComplete from './autoComplete'
import autoNormalize from './autoNormalize'

const prompt = promptSync()

function argPrompt(question, argConfig) {
  const options = { autoComplete: argConfig.autoComplete }
  let formatDetails = null
  if (argConfig.hasOwnProperty('format')) {
    formatDetails = resolveFormat(argConfig.format)
    if (!argConfig.hasOwnProperty('autoComplete')) {
      options.autoComplete = getAutoComplete(formatDetails)
    }
  }
  if (typeof argConfig.askQuestion != 'function') argConfig.askQuestion = askQuestion
  let response
  if (typeof argConfig.askQuestion != 'function') {
    console.log(question)
    response = prompt('> ', options)
  } else {
    response = await argConfig.askQuestion(question, argConfig, formatDetails)
  }
  if (formatDetails !== null) {
    response = autoNormalize(response, formatDetails)
    sanitize(response, reconstructFormat(formatDetails))
  }
  return response
}

function getAutoComplete(formatDetails, extraOptions = []) {
  const { format } = formatDetails
  if (format === Boolean) return autoComplete(['yes', 'no'].concat(extraOptions))
  return null
}

export default argPrompt
