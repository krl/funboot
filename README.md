# funboot
## to get started

sudo npm install -g funboot

cp funboot-names ~/.funboot-names

## explanation

funboot is a tool that boots javascript from ipfs

it includes its own import tool, an example file would look like this:
```js
$env.log('hello from funboot')
module.exports = function () {
  $env.log('i can be called as well')
}
```

to get it ready for use, run:
```bash
funboot import test.js
```

```
file: test.js
test QmdgkBdLKEQk2qgh7q89yfanCGZW6Nx2zpeabog58tBuSL
```

This also writes the last line of the output to ~/.funboot-names

To run it, simply do

```bash
funboot test
```

the output should be: hello from funboot

If you then write a file test-boot.js

```js
$env.boot($env, 'test').then(function (bootme) {
  bootme()
})
```

with
```bash
funboot test-boot
```

the output will be:

```
hello from funboot
i can be called as well
```

You get it right?

## built-in commands
### help

Prints a help message, is also the default if no argument is provided

### import

The bootstrap command, it is responsible for importing other scripts, and new versions of itself.

example syntax:
```bash
funboot import test.js
funboot import index.js --with-name test
funboot import --browserify --with-name between index.js
```

Also appends the newly imported name to ~/.funboot-names

### unbooted_import
If you want to bootstrap yourself, you can use
```bash
node cmd/unbooted_import.js cmd/import.js
```

And then, of course
```bash
funboot import cmd/import.js
```

Feel the metaprogramming excitement wash over you

### testlog

To test the $env.log() functionality

### between
Is an import of domanics between library, used to test browserify import.

### env
Just prints the enviroment variable, including arguments, etc

### name

```bash
funboot name name
```

Resolves the hash of the name provided

```bash
funboot name --all
```

Prints all known names

### bootme

An example script to be used from the next in this list

### boot-example

Boots bootme

### lodash

Browserify import of lodash, for use in name, etc


### boot-browserified-example

Boots 'between' and makes it spit some text