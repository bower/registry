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



module.exports = {
  before: (function () {

    before(function () {
      server.start();
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
