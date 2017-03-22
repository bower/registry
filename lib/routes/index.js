'use strict';

var rateLimit = require('express-rate-limit');
var limiter = rateLimit({ delayMs: 200, windowMs: 5000, max: 0 });

module.exports = function(app) {
  var routes = {
    root: require('./root'),
    packages: require('./packages'),
  };

  app.get('/', function(req, res) {
    res.redirect(302, 'http://bower.io/search/');
  });

  app.get('/status', routes.root.status);
  app.get('/stats', routes.packages.stats);
  app.get('/packages', limiter, routes.packages.list);
  app.get('/packages/:name', routes.packages.fetch);
  app.get('/packages/search/', routes.packages.search);
  app.get('/packages/search/:name', routes.packages.search);
  app.post('/packages', routes.packages.create);
  app.delete('/packages/:name', routes.packages.remove);
};
