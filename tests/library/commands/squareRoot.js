function squareRoot(x) {
  return Math.sqrt(x)
}

module.exports = {
  handler: squareRoot,
  primaryArgs: ['number'],
  args: {
    number: {
      format: { _: Number, finite: true },
      required: true
    }
  }
}
