if (!$env.args[0]) {
  $env.error('name: no name given')
}

if ($env.args[0] === '--all') {
  $env.boot($env, 'lodash').then(function (_) {
    _.map($env.names, function (v, k) {
      console.log(k + ' ' + v)
    })
  })
} else {
  console.log($env.names[$env.args[0]])
}
