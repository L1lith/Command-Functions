const library1 = require('./tests/library1')
const { Options } = library1

console.log(library1.saySomething(new Options({ message: 'tomato' })))
