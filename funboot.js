#!/usr/bin/env node
'use strict'

var ipfs = require('ipfs-api')()
var brow = require('browserify')
var fs = require('fs')
var _ = require('lodash')
var Q = require('kew')

var names = {'help': 'QmSY6Wj4cdHw6grXv2etA4RFiCbigcqpRD5aM7vTdfwniR'}

// local directory names overrides hard coded names

try {
  var local_names = fs.readFileSync('./funboot-names', {encoding: 'utf-8'})
  _.map(local_names.split('\n'), function (x) {
    var split = x.split(' ')
    if (split[1]) {
      names[split[0]] = split[1]
    }
  })
} catch (e) {}

var register = function (name, hash) {
  fs.appendFile(process.env['HOME'] + '/.funboot-names',
                name + ' ' + hash + '\n', function () {})
  log("registered: " + name + ' ' + hash)
}

// user .funboot-names overrides everything else

try {
  var user_names = fs.readFileSync(process.env['HOME'] + '/.funboot-names', {encoding: 'utf-8'})
  _.map(user_names.split('\n'), function (x) {
    var split = x.split(' ')
    if (split[1]) {
      names[split[0]] = split[1]
    }
  })
} catch (e) {}

function slurp (stream) {
  var def = Q.defer()
  var buf = ''
  stream
    .on('data', function (data) {
      buf += data
    })
    .on('end', function () {
      def.resolve(buf)
    })
  return def.promise
}

function error (err) {
  console.log(err + ' (fatal)')
  process.exit(1)
}

function log (msg) {
  console.log(msg)
}

function get_args () {
  return process.argv.slice(2)
  if (typeof window !== 'undefined') {

  }
}

function boot (env, pluraltoboot, cb) {
  if (typeof pluraltoboot === "string") {
    return boot(env, [pluraltoboot], cb)
  }
  if (!pluraltoboot) pluraltoboot = ['help']

  var promises = _.map(pluraltoboot, function (toboot) {
    var def = Q.defer()
    var resolved
    if (names[toboot]) {
      resolved = names[toboot]
    } else {
      resolved = toboot
    }
    ipfs.cat(resolved, function (err, res) {
      if (err) {
        if (resolved.length < 46) {
          // no multihash
          console.log('Error: ' + resolved + ' is not a known name')
          process.exit(1)
        }
        console.log('ipfs error: ' + JSON.stringify(err))
        process.exit(1)
      }
      slurp(res).then(function (data) {
        var result
        try {
          var fun = eval(data.trim())
          var module
          result = fun.call(module, env)
          if (typeof result === 'undefined') {
            // browserify through UMD
            result = root.module
          }
        } catch (e) {
          error(e)
        }
        def.resolve(result)
      })
    })
    return def.promise
  })

  Q.all(promises).then(function (evaluated) {
    if (cb) {
      cb.apply(undefined, evaluated)
    }
  })
}

var args = get_args()

boot({
  ipfs: ipfs,
  boot: boot,
  brow: brow,
  register: register,
  fs: fs,
  names: names,
  error: error,
  log: log,
  args: args.slice(1)
}, args[0])
