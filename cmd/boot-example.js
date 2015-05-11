(function (env) {
  env.log("booting up...")
  env.boot(env, ['bootme', 'bootme2'], function (bootme, bootme2) {
    env.log("calling bootme")
    bootme()
    env.log("calling bootme2")
    bootme2()
  })
  env.log("wonk...")
})
