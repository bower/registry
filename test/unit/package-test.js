var expect = require('expect.js');

var Package = require('../../lib/models/package');
var testHelper = require('../support/test-helper');
var registry = testHelper.registry;

var mockData = new testHelper.factories.package();

testHelper.mocks(registry.url(), testHelper.opts, testHelper.ddocs);

describe('Package', function () {

  beforeEach(function (done) {

    registry.promise.then(function () {
      done();
    });

  });

  describe('Model', function () {

    beforeEach(function () {
      this.pkg = new Package(registry, mockData);
    });

    describe('Constructor', function () {

      it('should be an instance of Package', function () {
        expect(this.pkg).to.be.a(Package);
      });

      it('should have normal exposed props', function () {
        expect(this.pkg.registry).to.eql(registry);
        expect(this.pkg._model).to.be.a(Object);
      });

    });

    describe('Property initialization and retrieval', function () {

      it('should happen on construction', function () {
        expect(this.pkg.get('name')).to.eql(mockData.name);
        expect(this.pkg.get('versions')).to.eql(mockData.versions);
        expect(this.pkg.get('url')).to.eql(mockData.url);
      });

      it('should have a \'name\' property', function () {
        expect(this.pkg._model).to.have.property('name');
      });

      it('should have a \'description\' property', function () {
        expect(this.pkg._model).to.have.property('description');
      });

      it('should have a \'type\' property', function () {
        expect(this.pkg._model).to.have.property('type');
      });

      it('should have a \'owners\' property', function () {
        expect(this.pkg._model).to.have.property('owners');
      });

      it('should have a \'versions\' property', function () {
        expect(this.pkg._model).to.have.property('versions');
      });

      it('should have a \'keywords\' property', function () {
        expect(this.pkg._model).to.have.property('keywords');
      });

      it('should have a \'url\' property', function () {
        expect(this.pkg._model).to.have.property('url');
      });

    });

    describe('Property assignment', function () {

      it('should work using .set()', function () {
        this.pkg.set('main', ['file.js']);
        expect(this.pkg.get('main')).to.eql(['file.js']);
      });

    });

    describe('toObject', function () {

      it('should have public properties', function () {
        var obj = this.pkg.toObject();

        expect(obj.name).to.eql(this.pkg.get('name'));
        expect(obj.versions).to.eql(this.pkg.get('versions'));
        expect(obj.url).to.eql(this.pkg.get('url'));
      });

      it('should not have private properties', function () {
        var obj = this.pkg.toObject();
        expect(obj.resource).to.be(undefined);
      });

    });

    describe('toJSON', function () {

      it('should be the same as toObject', function () {
        var obj = this.pkg.toObject();
        var json = this.pkg.toJSON();

        expect(JSON.parse(json)).to.eql(obj);
      });

    });

  });

});

