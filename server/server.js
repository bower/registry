//
// # server/server
//

process.env.NODE_ENV = process.env.NODE_ENV || "development";

var express   = require('express'),
    _         = require('lodash'),
    app       = module.exports = express(),
    path      = require('path');
var Registry = require('./..lib/registry');

var setHeaders = require(path.normalize(__dirname + '/../lib/middleware/headers')),
    setOptions = require(path.normalize(__dirname + '/../lib/middleware/options'));

var modules = {
  'search': {
    require: '../lib/modules/search',
    route: '/packages/search/:name'
  }
};


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
    app.use(setOptions());
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(function(err, req, res) {
       console.dir(err);
        req.send(500, 'Something broke!');
    });
  });
  
  var registry = new Registry(opts);
  // registry.addModule('search', require('../lib/modules/search'));
  
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
  
  _.each(modules, function(i, v) {
    var module = require(v.path);
    registry.addModule('search', module);
    app.get(v.route, module.run);
  });

  /*
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
  */

  // Actually listen
  app.listen(opts.port || null);
  console.log("Serving at http://localhost:" + (opts.port || ''));
};
