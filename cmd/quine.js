(function (env) {
  env.boot(env, 'slurp', function (slurp) {
    slurp(env.names['quine'], function (err, data) {
      env.log(data)
    })
  })
})
