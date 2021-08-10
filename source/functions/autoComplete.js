function autoComplete(commands) {
  return function (str) {
    var i
    var ret = []
    for (i = 0; i < commands.length; i++) {
      if (commands[i].indexOf(str) == 0) ret.push(commands[i])
    }
    return ret
  }
}

export default autoComplete
