/*globals before:true, after:true*/

var opts = require('../../config/testing.json');
var factories = require('./factories');
var url = opts.app.https ? 'https' : 'http' +  '://' + opts.app.host + ':' + opts.app.port + '/';

var Server = require('../../server/server.js');
var mocks = require('./couch-mocks');
var ddocs = require('../../couchapp/ddocs');

var Registry = require('../../lib/registry');

var registry = new Registry(opts);
var server = new Server(registry, opts.app);


// server components
var rootRoutes = require('../../lib/routes/root.js');
var packageRoutes = require('../../lib/routes/package.js');
var userRoutes = require('../../lib/routes/user.js');

server.applyRoutes(rootRoutes);
server.applyRoutes(packageRoutes, registry);
server.applyRoutes(userRoutes, registry);

module.exports = {
  before: (function () {

    before(function () {
      server.start(opts);
    });

  }()),
  beforeEach: (function () {

    beforeEach(function () {});

  }()),
  afterEach: (function () {

    afterEach(function () {});

  }()),
  after: (function () {

    after(function () {});

  }()),
  url: url,
  factories: factories,
  registry: registry,
  opts: opts,
  mocks: mocks,
  ddocs: ddocs
};
