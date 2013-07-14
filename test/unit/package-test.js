var Registry = require('../../lib/registry.js');
var Packages = require('../../lib/collections/packages');
var _ = require('lodash');
var expect = require('expect.js');
var http = require('http');
var ddocs = require('../../couchapp/ddocs.js');
var mocks = require('../support/couch-mocks');

describe('Package', function() {

  'use strict';

  var opts = require('../../config/testing.json');
  var registry = new Registry(opts);
  var packages = new Packages();

  mocks(registry.url(), opts, ddocs);

  describe('Collection', function() {

    describe("Constructor", function() {
      it('should be an instance of Packages', function() {
        expect(true).to.be.ok();
        expect(packages).to.be.a(Packages);
        expect(packages).to.have.property('length')
        expect(packages).to.have.property('reset');
      });
    });

  });

});

