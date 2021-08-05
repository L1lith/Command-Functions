import chalk from 'chalk'
import util from 'util'

const primitiveMap = new Map([
  [String, 'String'],
  [Number, 'Number'],
  [Object, 'Object'],
  [Function, 'Function']
])

function stringifySandhandsFormat(format) {
  if (primitiveMap.has(format)) {
    return chalk.green(primitiveMap.get(format))
  } else if (typeof format == 'object') {
    if (format === null) return chalk.grey('null')
    let output = chalk.white('{ ')
    output +=
      Object.entries(format)
        .map(([arg, value]) => {
          return chalk.white(arg) + ': ' + stringifySandhandsFormat(value)
        })
        .join(chalk.white(', ')) + chalk.white(' }')
    return output
  } else {
    return util.inspect(format, { colors: true })
  }
}

export default stringifySandhandsFormat
