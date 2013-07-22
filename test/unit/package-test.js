var Registry = require('../../lib/registry.js');
var Package = require('../../lib/models/package');
var _ = require('lodash');
var expect = require('expect.js');
var http = require('http');
var ddocs = require('../../couchapp/ddocs.js');
var mocks = require('../support/couch-mocks');

describe('Package', function() {

  'use strict';

  var opts = require('../../config/testing.json');
  var registry = new Registry(opts);

  var mockData = {
    name: 'thename',
    version:'1.2.3',
    url: 'https://github.com/bower/registry.git'
  };

  mocks(registry.url(), opts, ddocs);

  describe('Collection', function() {

    beforeEach(function() {
      this.p = new Package(registry, mockData);
    }); 
      

    describe("Constructor", function() {
      it('should be an instance of Package', function() {
        expect(this.p).to.be.a(Package);
      });
      it('should have normal exposed props', function() {
        expect(this.p.registry).to.equal(registry);
        expect(this.p._model).to.be.a(Object);
      });
    });

    describe("Property initialization", function() {
      it('should happen on construction', function() {
        expect(this.p.get('name')).to.equal(mockData.name);
      });
    });

  });

});

