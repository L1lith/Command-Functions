const defaultFruit = ['tomato', 'banana', 'grape']

function fruit(fruitChoice) {
  console.log(fruitChoice)
  return `Picking a fresh ${fruitChoice} :)`
}

module.exports = {
  handler: fruit,
  args: {
    fruitChoice: {
      argsPosition: 0,
      format: String,
      getDefault: () => defaultFruit[Math.floor(Math.random() * defaultFruit.length)]
    }
  }
}
