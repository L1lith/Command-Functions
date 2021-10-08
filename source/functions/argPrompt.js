import { resolveFormat, reconstructFormat, sanitize, valid } from 'sandhands'
import { default as promptSync } from 'prompt-sync'
import autoComplete from './autoComplete'
import autoNormalize from './autoNormalize'
import askQuestion from './askQuestion'

const prompt = promptSync()

function argPrompt(question, argConfig = {}) {
  const options = { autoComplete: argConfig.autoComplete }
  let formatDetails = null
  if (argConfig.hasOwnProperty('format')) {
    formatDetails = resolveFormat(argConfig.format)
    if (!argConfig.hasOwnProperty('autoComplete')) {
      options.autoComplete = getAutoComplete(formatDetails)
    }
  }
  //if (typeof argConfig.askQuestion != 'function') argConfig.askQuestion = askQuestion
  let response
  if (typeof argConfig.askQuestion != 'function') {
    console.log(question)
    response = prompt('> ', options)
  } else {
    response = argConfig.askQuestion(question, argConfig, formatDetails)
  }
  if (formatDetails !== null) {
    response = autoNormalize(response, formatDetails)
    sanitize(response, reconstructFormat(formatDetails))
  }
  return response
}

function getAutoComplete(formatDetails, extraSuggestions = []) {
  const { format, options = {} } = formatDetails
  let suggestions = [...extraSuggestions]
  if (format === Boolean) suggestions = suggestions.concat(['yes', 'no'])
  if (format === String && options.hasOwnProperty('equalTo')) {
    suggestions = suggestions.concat(format.equalTo)
  }
  return autoComplete(suggestions)
}

export default argPrompt
