var expect = require('expect.js');
var Registry = require('../../lib/registry.js');

var testHelper = require('../support/test-helper');
var registry = testHelper.registry;

testHelper.mocks(registry.url(), testHelper.opts, testHelper.ddocs);

describe('Registry', function () {

  describe('Constructor', function () {

    describe('makes a registry object', function () {

      it('should instanciate and create properties', function () {
        expect(registry).to.be.a(Registry);
        expect(registry).to.have.property('couch');
      });

      it('should inherit prototype methods', function () {
        expect(registry).to.have.property('get');
        expect(registry).to.have.property('show');
        expect(registry).to.have.property('list');
        expect(registry).to.have.property('attachment');
        expect(registry.attachment).to.have.property('insert');
        expect(registry.attachment).to.have.property('get');
      });

      it('should resolve with correct database', function (done) {
        registry.promise.then(function (db) {
          expect(db.config.db).to.eql(testHelper.opts.db.name);
          done();
        });
      });

    });

  });

});

