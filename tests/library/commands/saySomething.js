function saySomething(message) {
  return message
}

module.exports = {
  handler: saySomething,
  primaryArgs: ['message'],
  args: {
    message: {
      normalize: message => (typeof message == 'string' ? message.toUpperCase() : message),
      format: String,
      default: 'hello world'
    }
  }
}
