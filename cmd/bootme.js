(function (env) {
  env.log('i have been booted, feels so good!')
  return function () {
    env.log('call me, boot me')
  }
})
