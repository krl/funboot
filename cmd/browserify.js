(function (env) {
  if (env.args.length < 2) {
    env.error('usage: browserify file export-name')
  }

  var browserify = env.brow(
    [env.args[0]],
    {standalone: 'module'})

  browserify.bundle(function (err, bund) {
    if (err) env.error(err)
    var wrapped = new Buffer("(function () {" + bund + "})")
    env.ipfs.add(wrapped, function (err, res) {
      if (err) env.error(err)
      env.register(env.args[1], res[0].Hash)
    })
  })
})
