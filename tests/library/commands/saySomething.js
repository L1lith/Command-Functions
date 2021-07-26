function saySomething(message) {
  return message
}

module.exports = {
  handler: saySomething,
  primaryArgs: ['message'],
  args: {
    message: {
      format: String,
      default: 'hello world'
    }
  }
}
