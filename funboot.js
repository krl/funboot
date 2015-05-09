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

function evaluate (env, js) {
  var padded = '(function ($env) {' + js + ' ;return(module)})'
  // lexical scope for evaluated js
  var module = {}
  var fun = eval(padded)

  fun(env)

  return module.exports
}

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

function boot (env, toboot) {
  var def = Q.defer()
  var resolved
  if (!toboot) toboot = 'help'
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
      var result = evaluate(env, data)
      def.resolve(result)
    })
  })
  return def.promise
}

boot({
  ipfs: ipfs,
  boot: boot,
  brow: brow,
  fs: fs,
  names: names,
  error: error,
  log: log,
  args: process.argv.slice(3)
}, process.argv[2])
