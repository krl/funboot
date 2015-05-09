var file, browserify

var ErrNoArgument = {message: 'No argument provided to import',
                     exit: 1}

if (typeof $env === 'undefined') {
  $env = {log: console.log,
          args: process.argv.slice(2),
          error: function (err) {
            console.log('Error: ' + err.message)
            if (err.exit) {
              process.exit(err.exit)
            }
          },
          fs: require('fs'),
          ipfs: require('ipfs-api')(),
          browserify: require('browserify')()
         }
}

if (!$env.args.length) {
  $env.error(ErrNoArgument)
}

if ($env.args[0] === 'browserify') {
  browserify = true
  file = $env.args[1]
} else {
  file = $env.args[0]
}

function handle_add (err, res) {
  if (err) {
    $env.error('ipfs-error: ' + JSON.stringify(err))
    process.exit(1)
  }
  var split = file.split('/')
  var name = split[split.length - 1].split('.')[0]
  var hash = res[0].Hash
  $env.fs.appendFile(process.env['HOME'] + '/.funboot-names',
                     name + ' ' + hash + '\n', function () {})
  $env.log(name + ' ' + res[0].Hash)
}

if (browserify) {
  $env.log('using browserify')
  $env.brow.add(file)
  $env.brow.bundle(function (err, bund) {
    if (err) throw err
    $env.ipfs.add(bund, handle_add)
  })
} else {
  var data = $env.fs.readFileSync(file)
  $env.ipfs.add(data, handle_add)
}
