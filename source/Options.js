class Options {
  constructor(initializer) {
    if (typeof initializer == 'object' && initializer !== null) {
      Object.assign(this, initializer)
    }
  }
}

export default new Proxy(Options, {
  apply: function (target, that, args) {
    // Make the function execution behave as a constructor mirror without requiring "new"
    return new Options(...args)
  }
})
