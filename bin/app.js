#!/usr/bin/env node

server = require('../server/server.js');
server();

process.env.NODE_ENV = process.env.NODE_ENV || "testing";

var couchapp = require('couchapp');
var docs = require('./ddocs');
var path = require('path');
var fs = require('fs');
var Nano = require('nano');
var config = require('konphyg')(path.normalize(__dirname + '/../config'));

// configuration information
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

  } else {
    arg1 || process.env.NODE_ENV;
  }

  console.log('Loading ' + arg1 + ' configuration data');
  return config(arg1 || process.env.NODE_ENV);
}());

var nano = Nano(options.protocol + '://' +
                options.username +
                ':' + options.password +
                '@' + options.host +
                ':' + options.port);
