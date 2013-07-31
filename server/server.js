//
// # server/server
//

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express   = require('express');
var _         = require('lodash');
var app       = express();
var fs        = require('fs');
var path      = require('path');
var pkgJson   = require('../package.json');
var http      = require('http');
var https     = require('https');

var setHeaders = require('./middleware/headers');
var setOptions = require('./middleware/options');

var Packages = require('../lib/collections/packages');
var Package = require('../lib/models/package');



var server = function (registry, opts) {

  opts = _.extend({
    port :      registry.options.app.port,
    protocol :  registry.options.app.https ? 'https' : 'http' +  '://'
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
      'registry': pkgJson.version,
      'name': pkgJson.name,
      'description': pkgJson.description
    };

    res.json(payload, 200);
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
    var ca, privateKey, certificate, node;

    if (!registry.options.app.https) {
      node = http.createServer(app);
      node.listen(opts.port || null);

      console.log('Serving at http://localhost:' + (opts.port || ''));
    } else {

      try {
        privateKey = fs.readFileSync(path.resolve(__dirname + '/cert/key.pem')).toString();
      }
      catch (err) {
        console.error('For an https server please add a private key in /cert/key.pem');
        console.log(err);
        return;
      }

      try {
        certificate = fs.readFileSync(path.resolve(__dirname + '/cert/certificate.pem')).toString();
      }
      catch (err) {
        console.error('For an https server please add a certificate in /cert/certificate.pem');
        console.log(err);
        return;
      }

      node = https.createServer({
        key: privateKey,
        cert: certificate,
        ca: ca
      }, app);
      node.listen(opts.port || null);

      console.log('Serving at https://localhost:' + (opts.port || ''));
    }

  }, function (err) {
    console.log('Error starting connection to DB');
    console.log(err);
  });

  return;
};

module.exports = server;
