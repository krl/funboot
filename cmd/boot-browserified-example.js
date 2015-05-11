(function (env) {
  env.boot(env, 'between', function (between) {
    env.log('hello, here is browserified between!')
    env.log(between('a', 'b'))
  })
})
