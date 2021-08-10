function askAboutMyDay(response) {
  return `I see... so to reiterate what you might say about today, you thought it was ${
    response ? 'good' : 'bad'
  }.`
}

module.exports = {
  handler: askAboutMyDay,
  args: {
    response: {
      format: Boolean,
      prompt: 'Did you enjoy your day?',
      required: true,
      argsPosition: 0
    }
  }
}
