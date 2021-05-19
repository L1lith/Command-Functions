function parseoptions(argsObject, parserOptions = {}) {
  //if (!Array.isArray(args)) throw new Error('Please supply an argument array')
  let options = { ...argsObject }
  const { name = null } = parserOptions
  let { primaryArgs = [] } = parserOptions
  if (
    (primaryArgs.length > 0) +
      (Array.isArray(options._) && options._.length > 0) +
      (typeof name == 'string' && Array.isArray(options[name]) && options[name].length) >
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
      : typeof name == 'string' && options[name]?.length > 0
      ? options[name]
      : []
  delete options[name]
  delete options._
  if (primaryArgs.length > 0) {
  }
  //console.log({ options, primaryArgs, name })
  return { options, primaryArgs, name }
}

export default parseoptions
