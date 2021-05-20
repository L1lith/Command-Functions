function parseOptions(argsObject, parserOptions = {}) {
  //if (!Array.isArray(args)) throw new Error('Please supply an argument array')
  let options = { ...argsObject }
  const { commandName = null } = parserOptions
  let { primaryArgs = [] } = parserOptions
  if (
    (primaryArgs.length > 0) +
      (Array.isArray(options._) && options._.length > 0) +
      (typeof commandName == 'string' &&
        Array.isArray(options[commandName]) &&
        options[commandName].length) >
    1
  )
    throw new Error(
      'Cannot supply more than one set of primary arguments, either through the command name, the function parameters, or the _ property'
    )
  primaryArgs =
    primaryArgs?.length > 0
      ? primaryArgs
      : options?._?.length > 0
      ? options._
      : typeof commandName == 'string' && options[commandName]?.length > 0
      ? options[commandName]
      : []
  delete options[commandName]
  delete options._
  if (primaryArgs.length > 0) {
  }
  //console.log({ options, primaryArgs, name })
  return { options, primaryArgs, name: commandName }
}

export default parseOptions
