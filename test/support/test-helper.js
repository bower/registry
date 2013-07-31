/*globals before:true, after:true*/

var opts = require('../../config/testing.json');
var factories = require('./factories');
var cfg = opts.app;
var url = cfg.https ? 'https' : 'http' +  '://' + cfg.host + ':' + cfg.port + '/';
var Registry = require('../../lib/registry');
var server = require('../../server/server.js');
var registry = new Registry(opts);

module.exports = {
  before: (function () {

    before(function (done) {
      registry.promise.then(function () {
        server(registry);
        done();
      });
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
  opts: opts
};
