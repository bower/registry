//
// # server/server
//

process.env.NODE_ENV = process.env.NODE_ENV || "development";

var express   = require('express'),
    _         = require('lodash'),
    app       = module.exports = express(),
    path      = require('path');

var setHeaders = require(path.normalize(__dirname + '/../lib/middleware/headers')),
    setOptions = require(path.normalize(__dirname + '/../lib/middleware/options'));



var server = function(registry, opts) {

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
    app.use(setOptions());
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(function(err, req, res) {
       console.dir(err);
        req.send(500, 'Something broke!');
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

  //
  // routes
  //

  

  app.get('/packages', function(req, res) {
    pkgs.index(req, res);
  });

  app.get('/packages/:name', function(req, res) {
    pkgs.show(req, res);
  });

  app.get('/packages/search/:name', function(req, res) {
    pkgs.search(req, res);
  });

  app.post('/packages', function(req, res) {
    console.log('create');
    pkgs.create(req, res);
  });

  // Actually listen
  app.listen(opts.port || null);
  console.log("Serving at http://localhost:" + (opts.port || ''));
  return server;
};
module.exports = server;
