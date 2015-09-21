var FS = require('fs')
var Path = require('path')

var myfiles = ['install.js', 'package.json', 'readme.md', 'license.md', '.git']

function run() {
  var lifecycle = process.env.npm_lifecycle_event
  var ntm = process.cwd()
  var node_modules = Path.join(ntm, '..')
  if (Path.basename(node_modules) !== 'node_modules')
    return // Allows npm link; will do nothing
  var parent = Path.join(node_modules, '..')

  var package
  try {
    package = require(Path.join(parent, 'package'))
  }
  catch (err) {
    return // Allows npm link; will do nothing
  }

  var opts = package.ntm || {}

  var danger = !!opts.danger
  var linkedDirPath
  if (danger) {
    linkedDirPath = ntm
  }
  else if (opts.alias) {
    linkedDirPath = Path.join(node_modules, opts.alias)
  }
  else {
    // Use default path ntm/mod
    linkedDirPath = Path.join(ntm, 'mod')
  }

  if (danger) {
    // Remove all symlinks
    var filesToDelete = FS.readdirSync(ntm)
    filesToDelete.forEach(function(file) {
      var stat = FS.lstatSync(file)
      if (stat.isSymbolicLink()) {
        FS.unlinkSync(file)
      }
    })
  }
  else {
    // Delete existing dir
    try {
      FS.unlinkSync(linkedDirPath)
    }
    catch (err) {}
  }

  if (lifecycle === 'preuninstall') return true

  // Get source dir
  var sourcePath
  sourcePath = Path.join(parent, opts.src || 'mod')

  if (danger) {
    // Get contents and symlink each
    var files = FS.readdirSync(sourcePath)
    files.forEach(function(file) {
      var realfile = Path.join(sourcePath, file)
      var basename = Path.basename(file)
      console.log(('file'), file)
      console.log(('basename'), basename)
      // Deny overwriting ntm files.
      if (!myfiles.some(function(myfile) { return basename === myfile })) {
        // Symlink
        var stat = FS.statSync(realfile)
        if (stat.isFile()) {
          FS.symlinkSync(file, Path.join(ntm, Path.basename(file)), 'junction')
        }
        else {
          FS.symlinkSync(file, Path.join(ntm, Path.basename(file)), 'junction')
        }
      }
    })
  }
  else {
    // Symlink
    FS.symlinkSync(sourcePath, linkedDirPath, 'junction')
  }

  console.log('calling install script') // DEBUG
  console.log(1) // DEBUG
  var installFile = opts.install || 'install'
  console.log('installFile', installFile) // DEBUG
  require(Path.join(sourcePath, installFile))
  console.log(2) // DEBUG

  return true
}

module.exports = run

if (require.main === module) {
  try {
    run()
  }
  catch (err) {
    console.error(err.stack)
    process.exit(1)
  }
}
