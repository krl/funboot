$env.boot($env, 'between').then(function (between) {
  $env.log('hello, here is browserified between!')
  $env.log(between('a', 'b'))
})
