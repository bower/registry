var Registry = require('../../lib/registry.js');
var Packages = require('../../lib/collections/packages');
var Package = require('../../lib/models/package');
var _ = require('lodash');
var expect = require('expect.js');
var http = require('http');
var ddocs = require('../../couchapp/ddocs.js');
var mocks = require('../support/couch-mocks');

describe('Packages', function() {

  'use strict';

  var opts = require('../../config/testing.json');
  var registry = new Registry(opts);
  var mockData = [{
    name: 'thename',
    version:'1.2.3',
    url: 'https://github.com/bower/registry.git'
  }, {
    name: 'anothername',
    version: '3.2.1',
    url: 'http://github.com/bower/bower.git'
  }];
  mocks(registry.url(), opts, ddocs);

  beforeEach(function(done) {
    registry.promise.then(function() {
      done();
    });
  });

  describe('Collection', function() {

    beforeEach(function() {
      this.p = new Packages(registry);
    }); 
      

    describe("Constructor", function() {
      it('should be an instance of Packages', function() {
        expect(this.p).to.be.a(Packages);
      });
      it('should have normal exposed props', function() {
        expect(this.p.registry).to.equal(registry);
      });
    });

    describe("Instance", function() {
      it('should have array methods', function() {
        expect(this.p.forEach).to.be.a(Function);
        expect(this.p.map).to.be.a(Function);
        expect(this.p.slice).to.be.a(Function);
        expect(this.p.length).to.be(0);
      });
    });

    describe('Resetting', function() {

      describe('An Array of Data', function() {
        it('should create models', function() {
          this.p.reset(mockData);
          expect(this.p.length).to.be(2);
          expect(this.p[0]).to.be.a(Package);
          expect(this.p[1]).to.be.a(Package);
          expect(this.p[2]).to.be(undefined);
          var out = this.p[0].toObject();
          expect(out.name).to.equal(mockData[0].name);
        });
      });
      describe('An Array of Models', function() {
        it('should populate the controller with models', function() {
          this.p.reset([
            new Package(registry, mockData[0]),
            new Package(registry, mockData[1])
          ]);
          expect(this.p.length).to.be(2);
          expect(this.p[0]).to.be.a(Package);
          expect(this.p[1]).to.be.a(Package);
          expect(this.p[2]).to.be(undefined);
        });
      });
    });

  });

});

