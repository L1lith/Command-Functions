function squareRoot(number) {
  return Math.sqrt(number)
}

module.exports = {
  handler: squareRoot,
  args: {
    number: {
      format: { _: Number, finite: true },
      required: true,
      argsPosition: 0
    }
  },
  noOptions: true
}
