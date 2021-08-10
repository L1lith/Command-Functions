import { resolveFormat, valid } from 'sandhands'
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
    if (formatDetails.format === Boolean) {
      question += ' (yes/no)'
    }
  }
  console.log(question)
  let response = prompt('> ', options)
  //   if (formatDetails !== null) {
  //     response = autoNormalize(response, formatDetails)
  //   }
  return response
}

function getAutoComplete(formatDetails, extraOptions = []) {
  const { format } = formatDetails
  if (format === Boolean) return autoComplete(['yes', 'no'].concat(extraOptions))
}

export default argPrompt
