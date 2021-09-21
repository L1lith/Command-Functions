function saySomething(message) {
  return message
}

module.exports = {
  handler: saySomething,
  description: 'Says a thing or whatever',
  args: {
    message: {
      normalize: message => (typeof message == 'string' ? message.toUpperCase() : message),
      format: String,
      default: 'hello world',
      argsPosition: 0
    }
  },
  noOptions: true
}
