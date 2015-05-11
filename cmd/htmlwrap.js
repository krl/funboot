(function (env) {
  if (!env.args[0]) {
    env.error('must provide name to wrap')
  }

  env.boot(env, 'slurp', function (slurp) {
    slurp(env.names.index, function (err, data) {
      var split = data.indexOf('ツ')
      var buf = new Buffer(data.substr(0, split) +
                           '/ipfs/' + env.names[env.args[0]] +
                           data.substr(split+1))
      env.ipfs.add(buf, function (err, res) {
        if (err) env.error(err)
        env.log("http://localhost:5001/ipfs/" + res[0].Hash)
      })
    })
  })
})
