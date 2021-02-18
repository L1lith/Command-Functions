# Command Functions
Create functions that serve both as NPM libraries and CLI tools automatically

## How it works
#### Step 1 - Defining our Functions - Build a Command Map
First we create an object that maps our command names to their functions
```js
const commands = {
    version: ()=>"1.12.2",
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
import {CommandFunctions} from 'command-functions'

const commands = {
    version: ()=>"1.12.2",
    favoriteColor: () => Math.random() < 0.75 ? 'purple': 'green'
}
const app = new CommandFunctions(commands)
module.exports = app.autoRun() // Please read the warning on this method below
```
### Note: How args are parsed
When being run from the command line, Command Functions will parse your arguments internally using [Minimist](https://www.npmjs.com/package/minimist). Minimist will automatically parse all your arguments into their closest JSON approximation. Meaning the argument "age=[1,2,3]" will now make your function recieve an options object, whose age property will be an Array containing the numbers 1 through 3. Primary arguments will be passed in before the options object, meaning the input syntax for your function should look something like this
```js
function myFunction(firstPrimaryArg, secondPrimaryArg, options={}) {...}
```

### Providing additional command options
Instead of providing a function as the handler for a given command in your command map, you can wrap your function inside of an object, providing the function as the "handler" property. In this case the rest of the properties are treated as options. Here's an example of what a command using this syntax might look like
```js
const commands = {
    version: ()=>"1.12.2",
    favoriteColor: {
        handler: () => Math.random() < 0.75 ? 'purple': 'green',
        defaultCommand: true // Now the library will run this command if no command is specified.
    }
}
```

### Command Options
#### defaultCommand
Can only be assigned for one function. Setting this flag to true will make that command the default command when called via command line.

#### format
A [Sandhands](https://github.com/L1lith/Sandhands) format to validate that commands arguments. This can be used to ensure all of your arguments are formatted correctly. Comparison is done against the minimist object, so you're formatting against an object that looks like this
```js
{
   _: ["my", "primary", "options"],
   secondaryOption: true,
   randomOption: Math.random()
}
```
To ensure you recieved a valid set of primary arguments, you could provide a format that looks something like this
```
{
    _: [String],
    secondaryOption: Boolean,
    randomOption: Number
}
```

### Note: Why the .autoRun method is a little dangerous, and how you can avoid using it if you wish
The .autoRun method is dangerous because it relies on behavior that tries to detect the parent module. This behavior is deprecated as node wishes that modules keep to themselves and their children, however in our case it makes a lot more sense from the perspective of keeping users codebases short. Additionally I do think a bit of lienency should be given to this paradigm as our library serves as the entrypoint to the users entire library, so in this case Command-Functions is kind of like the parent module. We can prevent this behavior by handling the module detection logic inside of our code instead of letting the library do it. Here's a basic example of how you would do that
```js

import {CommandFunctions} from 'command-functions'

const commands = {
    version: ()=>"1.12.2",
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
module.exports = app.autoRun() // Please read the warning on this method below
```
As you can see this code is a little bit longer, but you are no longer relying on the deprecated module.parent method, and you can be extra sure the library knows whether or not it's being required as a library or run from the command line.