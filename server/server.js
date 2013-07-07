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
  
  function routeRegistryQuery(query, res) {
    query.then(function(packages) {
      res.send(data, 200);
    }, function(err) {
      res.send(err.message || 'Error', err['status-code'] || 400);
    });
  }
    

  app.get('/packages', function(req, res) {
    var query = Packages.all();
    routeRegistryQuery(query, res);
  });

  app.get('/packages/:name', function(req, res) {
    if (!req || req.params || req.params.name) {
      res.send('Missing package name', 400);
    }

    var query = Packages.show(req.params.name);
    routeRegistryQuery(query, res);
  });

  app.get('/packages/search/:name', function(req, res) {
    if (!req || req.params || req.params.name) {
      res.send('Missing search parameter', 400);
    }

    var query = Packages.search(req.params.name);
    routeRegistryQuery(query, res);
  });

  app.post('/packages', function(req, res) {
    var package = new Package(req.body);
    package.save().then(function(data) {
      res.send(data, 201);
    }, function(err) {
      res.json(err, 400);
    });
  });

  // Actually listen
  app.listen(opts.port || null);
  console.log("Serving at http://localhost:" + (opts.port || ''));
  return server;
};
module.exports = server;
