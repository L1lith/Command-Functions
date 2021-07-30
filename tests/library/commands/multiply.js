function multiply(...numbers) {
  numbers.pop() // Remove the options
  if (numbers.length < 1) throw new Error('Must supply at least 1 number')
  let output = 1
  numbers.forEach(n => {
    output *= n
  })
  return output
}

module.exports = multiply // Implicit Handler Syntax
