process.env.NODE_ENV = process.env.NODE_ENV || 'testing';

var couchapp = require('couchapp'),
    path = require('path'),
    docs = require('./ddocs'),
    config = require('konphyg')(path.normalize(__dirname + '/../config')),
    options = config('couch'),
    nano = require('nano')(
      options.protocol + '://' +
      options.username +
        ':' + options.password +
        '@' + options.host +
        ':' + options.port);

exports.setup = function (cb) {

  // clean up the database we created previously
  nano.db.destroy('bower-registry-testing', function () {

    nano.db.create('bower-registry-testing', function () {

      docs.forEach(function (doc) {
        couchapp.createApp(doc, 'http://localhost:5984/bower-registry-testing', function (app) {
          app.push();
          return cb(null, true);
        });
      });

    });

  });

};

exports.teardown = function (cb) {

  'use strict';

  nano.db.destroy('bower-registry-testing', function () {
    return cb(null, true);
  });

};

