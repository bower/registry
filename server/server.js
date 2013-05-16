//
// # server/server
//

process.env.NODE_ENV = process.env.NODE_ENV || "development";

var express   = require('express'),
    resource  = require('express-resource'),
    fs        = require('fs'),
    _         = require('lodash'),
    app       = module.exports = express(),
    path      = require('path'),
    config    = require('konphyg')(path.normalize(__dirname, '..', 'config/'));

var setHeaders = require(path.normalize(__dirname + '/../lib/middleware/headers'));


module.exports = function(opts) {

  'use strict';

  opts = _.extend({
    port :      3333,
    protocol : 'http',
    baseDir :   path.normalize(__dirname + '/../')
  }, opts || {});

  //
  // configure express middleware
  //
  app.configure(function() {
    app.use(setHeaders());
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(function(err, req, res, next){
      console.error(err.stack);
      res.send(500, 'Something broke!');
    });
  });

  //
  // setup environment
  //
  app.configure("development", function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));

    // log verbosely
    app.use(express.logger(({ format: ':method :status :url' })));
  });

  app.configure("production", function() {
    app.use(express.errorHandler());
  });

  app.resource('packages', require(opts.baseDir + 'lib/controllers/packages'));

  // Actually listen
  app.listen(opts.port || null);
  console.log("Serving at http://localhost:" + (opts.port || ''));
};
