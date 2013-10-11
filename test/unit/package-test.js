var expect = require('expect.js');
var _ = require('lodash');

var Package = require('../../lib/models/package');
var testHelper = require('../support/test-helper');
var registry = testHelper.registry;

var mockData = new testHelper.factories.Package();

testHelper.mocks(registry.url(), testHelper.opts, testHelper.ddocs);

describe('Package', function () {
    describe('Model', function () {
        var pkg;

        beforeEach(function () {
            pkg = new Package(mockData);
        });

        describe('Constructor', function () {

            it('should be an instance of Package', function () {
                expect(pkg).to.be.a(Package);
            });

            it('should have expose a \'search\' method', function () {
                expect(Package).to.have.property('search');
            });

            it('should have a \'get\' prototype method', function () {
                expect(pkg).to.have.property('get');
            });

            it('should have a \'set\' prototype method', function () {
                expect(pkg).to.have.property('set');
            });

            it('should have a \'toObject\' prototype method', function () {
                expect(pkg).to.have.property('toObject');
            });

            it('should have a \'toJSON\' prototype method', function () {
                expect(pkg).to.have.property('toJSON');
            });

            it('should have a \'validate\' prototype method', function () {
                expect(pkg).to.have.property('validate');
            });

            it('should have a \'save\' prototype method', function () {
                expect(pkg).to.have.property('save');
            });

            it('should have normal exposed props', function () {
                expect(pkg.model).to.be.a(Object);
            });

        });

        describe('Static members', function () {
            it('Package should have a \'destroy\' method', function () {
                expect(Package).to.have.property('destroy');
            });

            it('Package should have a \'search\' method', function () {
                expect(Package).to.have.property('search');
            });
        });

        describe('Property initialization and retrieval', function () {

            it('should happen on construction', function () {
                expect(pkg.get('name')).to.eql(mockData.name);
                expect(pkg.get('versions')).to.eql(mockData.versions);
                expect(pkg.get('url')).to.eql(mockData.url);
                expect(pkg.get('type')).to.eql(mockData.type);
                expect(pkg.get('keywords')).to.eql(mockData.keywords);
                expect(pkg.get('owners')).to.eql(mockData.owners);
                expect(pkg.get('description')).to.eql(mockData.description);
            });

            it('should have a \'name\' property', function () {
                expect(pkg.model).to.have.property('name');
            });

            it('should have a \'description\' property', function () {
                expect(pkg.model).to.have.property('description');
            });

            it('should have a \'type\' property', function () {
                expect(pkg.model).to.have.property('type');
            });

            it('should have a \'owners\' property', function () {
                expect(pkg.model).to.have.property('owners');
            });

            it('should have a \'versions\' property', function () {
                expect(pkg.model).to.have.property('versions');
            });

            it('should have a \'keywords\' property', function () {
                expect(pkg.model).to.have.property('keywords');
            });

            it('should have a \'url\' property', function () {
                expect(pkg.model).to.have.property('url');
            });

        });

        describe('Property assignment', function () {

            it('should work using .set()', function () {
                pkg.set('type', ['archive']);
                expect(pkg.get('type')).to.eql(['archive']);
            });

        });

        describe('toObject', function () {

            it('should have public properties', function () {
                var obj = pkg.toObject();

                expect(_.size(obj)).to.eql(8);

                expect(obj.name).to.eql(pkg.get('name'));
                expect(obj.description).to.eql(pkg.get('description'));
                expect(obj.type).to.eql(pkg.get('type'));
                expect(obj.versions).to.eql(pkg.get('versions'));
                expect(obj.keywords).to.eql(pkg.get('keywords'));
                expect(obj.url).to.eql(pkg.get('url'));
                expect(obj.resource).to.eql(pkg.get('resource'));
            });

            it('should not have private properties', function () {
                var obj = pkg.toObject();
                expect(obj.resource).to.be('packages');
            });

        });

        describe('toJSON', function () {

            it('should be the same as toObject', function () {
                var obj = pkg.toObject();
                var json = pkg.toJSON();

                expect(JSON.parse(json)).to.eql(obj);
            });

        });

    });

});

