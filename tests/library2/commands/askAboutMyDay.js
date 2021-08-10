function askAboutMyDay(response) {
  return `I see... so to reiterate what you might say about today, your feelings on the matter were "${response}"`
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
