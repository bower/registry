//
// test/models/package-test
//

var Model = require('../../lib/models/package'),
    test_helper = require('../support/test-helper'),
    couch = require('../../lib/db/couch'),
    factories = require('../support/factories'),
    _ = require('lodash'),
    expect = require('chai').expect;


describe('Package Model', function() {

  'use strict';

  beforeEach(function() {
    this.pkg = Model.factory(new factories.package());
  });

  describe('a package Model Constructor', function() {

    describe("instantiating an package object", function() {
      it('should set properties correctly', function() {
        expect(this.pkg._model).to.have.ownProperty('resource');
        expect(this.pkg._model).to.have.ownProperty('name');
        expect(this.pkg._model).to.have.ownProperty('url');
      });
    });

  });

  describe("attributes", function() {

    describe("name", function() {

      it('should not allow a blank value', function(done) {
        var pkg = Model.factory({
          url: 'git://asasdfasdf.git'
        });

        pkg.validate();
        expect(JSON.stringify(pkg.errors)).to.equal("{\"name\":[\"can't be blank\"]}");
        done();
      });

    });

    describe("url", function() {

      it('should not allow a blank value', function(done) {
        var pkg = Model.factory({
          name: 'bar',
        }, test_helper.redisClient);

        pkg.validate();
        expect(JSON.stringify(pkg.errors)).to.equal("{\"url\":[\"is invalid\"]}");
        done();
      });

    });

  });

  describe("methods", function() {

    describe("factory", function() {
      it('should should have a factory method', function() {
        var pkg = Model.factory({});

        expect(Model).to.have.ownProperty('factory');
      });
    });

    describe("save", function() {

      xit('should successfully save a key', function(done) {
        var self = this;
        var pkg = Model.factory({
          name: 'bar',
          url : 'git://someurl.git'
        });

        pkg.save(function(err, data) {
          self._savedID = data._id;
          expect(data).to.be.ok;
          done();
        });
      });

    });

    describe("validate", function() {

      it('should successfully validate a package', function() {
        var pkg = Model.factory({});

        pkg.validate();
        expect(!_.isEmpty(pkg.errors));
      });

    });

    describe("find", function() {

      it('should should have a find method', function() {
        var pkg = Model.factory({});

        expect(Model).to.have.ownProperty('find');
      });

      xit('should return results from the find method', function(done) {
        var self = this;

        Model.find(self._savedID, function(err, data) {
          expect(data._id).to.equal(self._savedID);
          done();
        });
      });

      it('should return null if the room does not exist', function(done) {
        var pkgId = 123;

        Model.find(pkgId, function(err, data) {
          expect(data).to.be.falsy;
          done();
        });
      });

    });

    describe("list", function() {

      it('should should have a list method', function() {
        var pkg = Model.factory({});

        expect(Model).to.have.ownProperty('list');
      });

      xit('should return results from the list method', function(done) {
        Model.list(function(err, data) {
          expect(_.keys(data).length).to.equal(1);
          expect(typeof(data[0])).to.equal('object');
          expect(data[0].resource).to.equal('package');
          done();
        });
      });

    });

  });

});

