var Model = require('../../lib/registry.js');
var _ = require('lodash');
var expect = require('chai').expect;
var mockdb = require('../support/couchmock');


describe('Registry', function() {

  'use strict';

  var opts = require('../../config/couch.testing.json');
  var registry = new Registry(mockdb, opts);


  describe('Constructor', function() {

    describe("makes a registry object", function() {
      it('should instanciate and create properties', function() {
        expect(registry).to.be.an.instanceof(Registry);
        expect(registry).to.have.ownProperty('db');
        expect(registry.db).to.have.ownProperty('get');
        expect(registry).to.have.ownProperty('name');
      });
      it('should inherit prototype methods', function() {
        expect(registry.run).to.equal(Registry.prototype.run);
      });
    });

  });



});

