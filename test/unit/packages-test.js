//
// test/unit/packages-test
//
var expect = require('expect.js');

var Packages = require('../../lib/collections/packages');
var Package = require('../../lib/models/package');

var testHelper = require('../support/test-helper');
var registry = testHelper.registry;

var mockData = new testHelper.factories.Packages(2);

testHelper.mocks(registry.url(), testHelper.opts, testHelper.ddocs);

describe('Packages', function () {

    beforeEach(function (done) {

        registry.promise.then(function () {
            done();
        });

    });

    describe('Collection', function () {

        beforeEach(function () {
            this.pkg = new Packages(registry);
        });

        describe('Constructor', function () {

            it('should be an instance of Packages', function () {
                expect(this.pkg).to.be.a(Packages);
            });

            it('should have normal exposed props', function () {
                expect(this.pkg.registry).to.eql(registry);
            });

            it('should have a \'constructor\' prototype method', function () {
                expect(this.pkg).to.have.property('constructor');
            });

            it('should have a \'reset\' prototype method', function () {
                expect(this.pkg).to.have.property('reset');
            });

            it('should have a \'resetQuery\' prototype method', function () {
                expect(this.pkg).to.have.property('resetQuery');
            });

            it('should have a \'toArray\' prototype method', function () {
                expect(this.pkg).to.have.property('toArray');
            });

            it('should have a \'all\' prototype method', function () {
                expect(this.pkg).to.have.property('all');
            });

            it('should have a \'search\' prototype method', function () {
                expect(this.pkg).to.have.property('search');
            });

            it('should have a \'fetch\' prototype method', function () {
                expect(this.pkg).to.have.property('fetch');
            });

        });

        describe('Instance', function () {

            it('should have array methods', function () {
                expect(this.pkg.forEach).to.be.a(Function);
                expect(this.pkg.map).to.be.a(Function);
                expect(this.pkg.slice).to.be.a(Function);
                expect(this.pkg.length).to.be(0);
            });

        });

        describe('Resetting', function () {

            describe('An Array of Data', function () {

                it('should create models', function () {
                    this.pkg.reset(mockData);
                    expect(this.pkg.length).to.be(2);
                    expect(this.pkg[0]).to.be.a(Package);
                    expect(this.pkg[1]).to.be.a(Package);
                    expect(this.pkg[2]).to.be(undefined);
                    var out = this.pkg[0].toObject();
                    expect(out.name).to.eql(mockData[0].name);
                });

            });

            describe('An Array of Models', function () {

                it('should populate the controller with models', function () {
                    this.pkg.reset([
                        new Package(registry, mockData[0]),
                        new Package(registry, mockData[1])
                    ]);

                    expect(this.pkg.length).to.be(2);
                    expect(this.pkg[0]).to.be.a(Package);
                    expect(this.pkg[1]).to.be.a(Package);
                    expect(this.pkg[2]).to.be(undefined);
                });

            });

        });

    });

});

