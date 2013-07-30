//
// # server/server
//

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express   = require('express');
var _         = require('lodash');
var app       = express();
var pkg       = require('../package.json');
var http      = require('http');

var setHeaders = require('./middleware/headers');
var setOptions = require('./middleware/options');

var Packages = require('../lib/collections/packages');
var Package = require('../lib/models/package');



var server = function (registry, opts) {

  opts = _.extend({
    port :      registry.options.app.port,
    protocol :  registry.options.app.protocol
  }, opts || {});

  //
  // configure express middleware
  //
  app.configure(function () {
    app.use(setHeaders());
    app.use(setOptions());
    app.use(express.bodyParser());
    app.use(express.compress());
    app.use(express.methodOverride());
    app.use(function (err, req, res, next) {
      console.dir(err.stack);
      req.send(500, 'Something broke!');
    });
  });

  //
  // setup environment
  //
  app.configure('development', function () {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));

    // log verbosely
    app.use(express.logger(({ format: ':method :status :url' })));
  });

  app.configure('production', function () {
    app.use(express.errorHandler());
  });

  //
  // routes
  //
  function routeRegistryQuery(query, res) {

    query.then(function (packages) {
      res.send(packages.toArray(), 200);
    }, function (err) {
      console.log(err.stack);
      res.send(err.message || 'Error', err['status-code'] || 400);
    }).done();

  }

  app.get('/', function (req, res) {
    var payload = {
      version: pkg.version,
      description: pkg.description
    };

    res.json(JSON.stringify(payload), 200);
  });

  app.get('/packages', function (req, res) {
    var packages = new Packages(registry);
    var query = packages.all();

    routeRegistryQuery(query, res);
  });


  app.get('/packages/:name', function (req, res) {
    var packages = new Packages(registry);
    var query = packages.fetch(req.params.name);

    routeRegistryQuery(query, res);
  });


  app.get('/packages/search/:name', function (req, res) {
    if (!req || req.params || req.params.name) {
      res.send('Missing search parameter', 400);
    }

    //var packages = new Packages(registry);
    var query = Packages.search(req.params.name);

    routeRegistryQuery(query, res);
  });

  app.post('/packages', function (req, res) {
    var p = new Package(registry, req.body);

    p.save().then(function (data) {
      res.send(data, 201);
    }, function (err) {
      res.json(err, 400);
    }).done();

  });

  // Actually listen when ready
  registry.promise.then(function () {
    app.listen(opts.port || null);
    console.log('Serving at http://localhost:' + (opts.port || ''));
  }, function (err) {
    console.log('Error starting connection to DB');
    console.log(err);
  });

  return server;
};

module.exports = server;
