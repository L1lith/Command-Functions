class Options {
  constructor(initializer) {
    if (typeof initializer == 'object' && initializer !== null) {
      Object.assign(this, initializer)
    }
  }
}

export default Options
