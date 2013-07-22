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

  beforeEach(function(done) {
    registry.promise.then(function() {
      done();
    });
  });

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

    describe("Property initialization and retrieval", function() {
      it('should happen on construction', function() {
        expect(this.p.get('name')).to.equal(mockData.name);
        expect(this.p.get('version')).to.equal(mockData.version);
        expect(this.p.get('url')).to.equal(mockData.url);
      });
    });

    describe('Property assignment', function() {
      it('should work using .set()', function() {
        this.p.set('main', ['file.js']);
        expect(this.p.get('main')).to.eql(['file.js']);
      });
    });

    describe('toObject', function() {
      it('should have public properties', function() {
        var obj = this.p.toObject();
        expect(obj.name).to.equal(this.p.get('name'));
        expect(obj.version).to.equal(this.p.get('version'));
        expect(obj.url).to.equal(this.p.get('url'));
      });
      it('should not have private properties', function() {
        var obj = this.p.toObject();
        expect(obj.resource).to.be(undefined);
      });

    });

    describe('toJSON', function() {
      it('should be the same as toObject', function() {
        var obj = this.p.toObject();
        var json = this.p.toJSON();
        expect(JSON.parse(json)).to.eql(obj);
      });
    });
        

  });

});

