(function (env) {
  var file, browserify
  var with_name, file

  if (env.args[0] === '--browserify') {
    browserify = true
    env.log('import: Using browserify')
    env.args = env.args.slice(1)
  }

  if (env.args[0] === '--with-name') {
    if (!env.args[1]) {
      env.error('import: No name provided')
    } else {
      with_name = env.args[1]
      env.log('import: Using name ' + with_name)
      env.args = env.args.slice(3)
    }
  }

  if (env.args.length === 0) {
    env.error('import: No file provided')
  }

  file = env.args[0]

  function handle_add (err, res) {
    if (err) {
      env.error('ipfs-error: ' + JSON.stringify(err))
      process.exit(1)
    }
    var split = file.split('/')
    if (!with_name) {
      with_name = split[split.length - 1].split('.')[0]
    }
    var hash = res[0].Hash
    env.register(with_name, hash)
  }

  if (browserify) {
    var browserify = env.brow(
      [file],
      {standalone: 'module'})

    browserify.bundle(function (err, bund) {
      if (err) {
        env.error(err)
      }

      env.ipfs.add(bund, handle_add)
    })
  } else {
    var data = env.fs.readFile(file, function (err, data) {
      if (err) {
        env.error(err)
      }
      env.ipfs.add(data, handle_add)
    })
  }
})
