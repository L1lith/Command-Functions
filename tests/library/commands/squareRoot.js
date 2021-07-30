function squareRoot(x) {
  return Math.sqrt(x)
}

module.exports = {
  handler: squareRoot,
  args: {
    number: {
      format: { _: Number, finite: true },
      required: true,
      argsPosition: 0
    }
  }
}
