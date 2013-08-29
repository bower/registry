//
// # server/server
//

var express   = require('express');
var _         = require('lodash');
var fs        = require('fs');
var path      = require('path');
var http      = require('http');
var https     = require('https');
var passport  = require('passport');

var setHeaders = require('../lib/middleware/headers');
var setOptions = require('../lib/middleware/options');
var setAuth = require('../lib/helpers/passport');

module.exports = function Server(registry, options) {

  var app = express();

  app.configure(function () {
    app.use(setHeaders());
    app.use(setOptions());
    app.use(passport.initialize());
    app.use(setAuth(passport, registry));
    app.use(express.bodyParser());
    app.use(express.compress());
    app.use(express.methodOverride());
    app.use(app.router);
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
  // server options
  //
  options = _.extend({
    port :      options.port,
    protocol :  options.https ? 'https' : 'http' +  '://'
  }, options);

  // expose the ability to add routes
  this.applyRoutes = function (module) {
    return module(app, registry);
  };


  this.start = function (srvSettings) {

    var defaults = {
      //key: path.join(__dirname + '/../' + srvSettings.app.ssl.key),
      //certificate: path.join(__dirname + '/../' + srvSettings.app.ssl.cert)
    };

    var settings = _.extend({}, defaults, srvSettings);

    registry.promise.then(function () {
      var ca, privateKey, certificate, node;

      if (!options.https) {

        node = http.createServer(app);
        node.listen(options.port || null);

        console.log('Serving at http://localhost:' + (options.port || ''));

      } else {

        try {
          privateKey = fs.readFileSync(settings.key).toString();
        }
        catch (err) {
          console.error('https server expected a private key in ' + settings.key);
          console.log(err);
          return;
        }

        try {
          certificate = fs.readFileSync(path.resolve(settings.certificate).toString());
        }
        catch (err) {
          console.error('https server expected a certificate in ' + settings.certificate);
          console.log(err);
          return;
        }

        node = https.createServer({
          key: privateKey,
          cert: certificate,
          ca: ca
        }, app);

        node.listen(options.port || null);
      }

    }, function (err) {
      console.log('Error starting connection to DB');
      console.log(err);
    }).done();

  };

  return this;
};

