/*globals before:true, after:true*/

var opts = require('../../config/testing.json');
var factories = require('./factories');
var cfg = opts.app;
var url = cfg.protocol + '://' + cfg.host + ':' + cfg.port + '/';
var Registry = require('../../lib/registry');
var server = require('../../server/server.js');

module.exports = {
  before: (function () {

    before(function (done) {
      var registry = new Registry(opts);
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
  factories: factories
};
