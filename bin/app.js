#!/usr/bin/env node

var server = require('../server/server.js');
var path = require('path');
var fs = require('fs');
var config = require('konphyg')(path.normalize(__dirname + '/../config'));

process.env.NODE_ENV = process.env.NODE_ENV || "testing";

// configuration information
// `node bin/app ../settings/config.json` => load specific config file
// `node bin/app '{"host"....'` => use passed json
// `node bin/app testing` => load testing.json profile in ./config
var options = (function() {
  var arg1 = process.argv[2];

  if (arg1) {

    // json file or raw json passed
    var json = arg1;
    var parsedJSON;
    // config file specified
    if (/\.json$/.test(arg1)) {
      console.log('Reading configuration data from ' + arg1);
      json = fs.readFileSync(path.resolve(arg1));
    }

    try {
      parsedJSON = JSON.parse(json);
    } catch(e){}

    if (parsedJSON) {
      return parsedJSON;
    }

  } 

  console.log('Loading ' + arg1 + ' configuration data');
  return config(arg1 || process.env.NODE_ENV);
}();

server(options);
