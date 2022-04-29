# Command Functions

Create your own node libraries that work both as node libraries and CLI tools at the same time

## How it works

#### Step 1 - Defining our Functions - Build a Command Map

First we create an object that maps our command names to their functions

```js
const commands = {
    favoriteColor: () => Math.random() < 0.75 ? 'purple': 'green'
}
```

#### Step 2 - Calling the Command Functions library

First install command functions as a dependency

```bash
npm install --save command-functions
```

Next use the CommandFunctions class to convert your functions into a library

```js
const {CommandFunctions} = require('command-functions') // Require syntax is also valid

const commands = {
    favoriteColor: () => Math.random() < 0.75 ? 'purple': 'green'
}
const app = new CommandFunctions(commands)
//
if (require.main === module) { // 
  run()
    .then(() => {
      console.log('Finished')
      process.exit(0)
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
} else {
  module.exports = app.getExports()
}

```

### Note: How args are parsed

When being run from the command line, Command Functions will parse your arguments internally using [Minimist](https://www.npmjs.com/package/minimist). Minimist will automatically parse all your arguments into their closest JSON approximation. Meaning the argument "age=\[1,2,3]" will now make your function receive an options object, whose age property will be an Array containing the numbers 1 through 3. Primary arguments will be passed in before the options object, meaning the input syntax for your function should look something like this

```js
function myFunction(firstPrimaryArg, secondPrimaryArg, options={}) {...}
```

### Providing additional command options

Instead of providing a function as the handler for a given command in your command map, you can wrap your function inside of an object, providing the function as the "handler" property. In this case the rest of the properties are treated as options. Here's an example of what a command using this syntax might look like

```js
const commands = {
    favoriteColor: {
        handler: () => Math.random() < 0.75 ? 'purple': 'green'
    }
}
```

### Command Options

#### handler

This is required for every command. It's a function that runs the command.

#### noOptions

Set this to true if you would not like your command to accept any options.

#### format

A [Sandhands](https://github.com/L1lith/Sandhands) format to validate that commands arguments. This can be used to ensure all of your arguments are formatted correctly. Each individual argument can be given it's own format, in which case the command might look like this

```js
{
   handler: someFunction,
   args: {
        name: {
            format: String // Gets Angry if the name argument provided is not a string
        }
   }
}
```

To ensure you received a valid set of primary arguments, you could provide a format that looks something like this

```javascript
{
    _: [String],
    secondaryOption: Boolean,
    randomOption: Number
}
```

### Note: Why the .autoRun method is a little dangerous, and how you can avoid using it if you wish

The .autoRun method is dangerous because it relies on behavior that tries to detect the parent module. This behavior is deprecated as node wishes that modules keep to themselves and their children, however in our case it makes a lot more sense from the perspective of keeping users codebases short. Additionally I do think a bit of lienency should be given to this paradigm as our library serves as the entrypoint to the users entire library, so in this case Command-Functions is kind of like the parent module. We can prevent this behavior by handling the module detection logic inside of our code instead of letting the library do it. Here's a basic example of how you would do that

```js

const {CommandFunctions} = require('command-functions')

const commands = {
    favoriteColor: () => Math.random() < 0.75 ? 'purple': 'green'
}
const app = new CommandFunctions(commands)
if (require.main === module) { // Running as command line
    app.runCLI().then(()=>{
        process.exit(0)
    }).catch(error => {
        console.error(error)
        process.exit(1)
    })
} else {
    module.exports = app.getExports()
}
```

As you can see this code is a little bit longer, but you are no longer relying on the deprecated module.parent method, and you can be extra sure the library knows whether or not it's being required as a library or run from the command line.
