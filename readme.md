# ntm

newly transformed modules

Actually just symlinks a directory in your module to your `node_modules` directory so you can do `require('<alias>/whatever')` anywhere.

[![npm](https://img.shields.io/npm/v/ntm.svg?style=flat-square)](https://www.npmjs.com/package/ntm)
[![Dependency Status](https://img.shields.io/david/seangenabe/ntm.svg?style=flat-square)](https://david-dm.org/seangenabe/ntm)
[![devDependency Status](https://img.shields.io/david/dev/seangenabe/ntm.svg?style=flat-square)](https://david-dm.org/seangenabe/ntm#info=devDependencies)

## Usage

### package.json options

```json
{
  "ntm": {
    "alias": "...",
    "src": "mod",
    "install": "install",
    "danger": false
  }
}
```

* `alias`: The alias to use in your `node_modules` folder. It's hard to even pick a specific one given it may conflict with any other module at any time, so I'm giving the option to do this to the user. Uses a `mod` folder (ntm/mod) inside this module if not provided.
* `src`: An *existing* folder in your module containing scripts or whatnot.
* `install`: install script filename, relative to `src`
* `danger`: enables danger mode. `alias` will be disregarded when set.

### Install

Make sure your `mod`/`<src>` folder exists before installing!

```bash
npm i ntm
```

### Writing scripts

Create a folder named `mod` or whatever you placed in `src`. For example, you created a script named `myscript.js`. Now miraculously you can now call it from anywhere in your module using `require('ntm/mod/myscript')`, if you specified an alias, replace `ntm/mod` with that alias.

### install.js

While installing the module, any file named `install.js` will be `require`-called, allowing for any module transformation or whatever.

### Re-run

```bash
cd node_modules/ntm
npm run postinstall
```

### Danger mode

Danger mode will try to link files to the ntm's own module directory, allowing `require('ntm/myscript')`. Awesome, right? But **make sure you know what you're doing.** Overwriting ntm's own files is not allowed.

### EPERM

If you get EPERM errors, obviously you do not have enough permissions to do the required operation.

### Suggestions for writing scripts

Do not make assumptions about the directory structure. Use `require` and `require.resolve`. You can use `__dirname` but for same-directory access only.

## License

MIT
