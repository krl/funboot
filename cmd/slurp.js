(function (env) {
  return function (hash, cb) {
    env.ipfs.cat(hash, function (err, stream) {
      if (err) env.error(err)
      var buf = ''
      stream
        .on('data', function (data) {
          buf += data
        })
        .on('error', function (err) {
          cb(err)
        })
        .on('end', function () {
          cb(undefined, buf)
        })
    })
  }
})
