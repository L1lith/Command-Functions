function multiply(...numbers) {
  if (numbers.length < 2) throw new Error('Must supply at least 2 numbers')
  let output = 1
  numbers.forEach(n => {
    output *= n
  })
  return output
}

module.exports = {
  handler: multiply,
  allowBonusArgs: true,
  noOptions: true,
  defaultCommand: true
}
