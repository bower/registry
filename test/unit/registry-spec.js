var expect = require('expect.js');

var testHelper = require('../support/test-helper');
var registry = testHelper.registry;

testHelper.mocks('http://localhost:3333/', testHelper.opts, testHelper.ddocs);

describe('Registry', function () {
    describe('Object', function () {

        describe('should be a registry object', function () {
            it('should have properties', function () {
                expect(registry).to.have.property('couch');
            });

            it('should provide a \'get\' method', function () {
                expect(registry).to.have.property('get');
            });

            it('should provide a \'list\' method', function () {
                expect(registry).to.have.property('list');
            });

            it('should provide a \'destroy\' method', function () {
                expect(registry).to.have.property('destroy');
            });

            it('should provide a \'attachment\' method', function () {
                expect(registry).to.have.property('attachment');
                expect(registry.attachment).to.have.property('insert');
                expect(registry.attachment).to.have.property('get');
            });

        });

    });

});

