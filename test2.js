const { details } = require('sandhands')

const normalInt = { _: Number, min: 0, finite: true, integer: true }

const argsFormat = {
  _: normalInt,
  _or: {
    _: [normalInt, normalInt],
    validate: ([num1, num2]) => (num1 < num2 ? true : 'The first number must be smaller')
  }
}

console.log(details(12, argsFormat))
console.log(details([12, 13], argsFormat))
