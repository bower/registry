var expect = require('expect.js');

var Packages = require('../../lib/collections/packages');
var Package = require('../../lib/models/package');

var testHelper = require('../support/test-helper');

var mockData = new testHelper.factories.Packages(2);

testHelper.mocks('http://localhost:3333/', testHelper.opts, testHelper.ddocs);

describe('Packages', function () {
    describe('Collection', function () {
        var pkg;

        beforeEach(function () {
            pkg = new Packages();
        });

        describe('Constructor', function () {

            it('should be an instance of Packages', function () {
                expect(pkg).to.be.a(Packages);
            });

            it('should have a \'constructor\' prototype method', function () {
                expect(pkg).to.have.property('constructor');
            });

            it('should have a \'reset\' prototype method', function () {
                expect(pkg).to.have.property('reset');
            });

            it('should have a \'resetQuery\' prototype method', function () {
                expect(pkg).to.have.property('resetQuery');
            });

            it('should have a \'toArray\' prototype method', function () {
                expect(pkg).to.have.property('toArray');
            });

            it('should have a \'all\' prototype method', function () {
                expect(pkg).to.have.property('all');
            });

            it('should have a \'search\' prototype method', function () {
                expect(pkg).to.have.property('search');
            });

            it('should have a \'fetch\' prototype method', function () {
                expect(pkg).to.have.property('fetch');
            });

        });

        describe('Instance', function () {

            it('should have array methods', function () {
                expect(pkg.forEach).to.be.a(Function);
                expect(pkg.map).to.be.a(Function);
                expect(pkg.slice).to.be.a(Function);
                expect(pkg.length).to.be(0);
            });

        });

        describe('Resetting', function () {

            describe('An Array of Data', function () {

                it('should create models', function () {
                    pkg.reset(mockData);
                    expect(pkg.length).to.be(2);
                    expect(pkg[0]).to.be.a(Package);
                    expect(pkg[1]).to.be.a(Package);
                    expect(pkg[2]).to.be(undefined);
                    var out = pkg[0].toObject();
                    expect(out.name).to.eql(mockData[0].name);
                });

            });

            describe('An Array of Models', function () {

                it('should populate the controller with models', function () {
                    pkg.reset([
                        new Package(mockData[0]),
                        new Package(mockData[1])
                    ]);

                    expect(pkg.length).to.be(2);
                    expect(pkg[0]).to.be.a(Package);
                    expect(pkg[1]).to.be.a(Package);
                    expect(pkg[2]).to.be(undefined);
                });

            });

        });

    });

});

