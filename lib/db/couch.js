//
// lib.db.couch
//

var nano = require('nano'),
    path = require('path'),
    config = require('konphyg')(path.normalize(__dirname + '/../../config')),
    options = config('couch');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = (function () {

  'use strict';

  var server = nano(
      options.protocol + '://' +
      options.username +
        ':' + options.password +
        '@' + options.host +
        ':' + options.port),
      db    = server.use(options.database);

  return db;

}());


