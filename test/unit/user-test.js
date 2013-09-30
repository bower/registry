var User = require('../../lib/models/user');
var expect = require('expect.js');

var testHelper = require('../support/test-helper');

var registry = testHelper.registry;
var mockData = new testHelper.factories.User();

testHelper.mocks(registry.url(), testHelper.opts, testHelper.ddocs);

describe('User', function () {

    beforeEach(function (done) {

        registry.promise.then(function () {
            done();
        });

    });

    describe('Model', function () {
        var user;

        beforeEach(function () {
            user = new User(mockData);
        });

        describe('Constructor', function () {

            it('should be an instance of User', function () {
                expect(user).to.be.a(User);
            });

            it('should have normal exposed props', function () {
                expect(user._model).to.be.a(Object);
            });

        });

        describe('Property initialization and retrieval', function () {

            it('should happen on construction', function () {
                expect(user.get('name')).to.eql(mockData.name);
                expect(user.get('password')).to.eql(mockData.password);
                expect(user.get('email')).to.eql(mockData.email);
                expect(user.get('url')).to.eql(mockData.url);
            });

        });

        describe('Property assignment', function () {

            it('should work using .set()', function () {
                user.set('email', 'some@email.com');
                expect(user.get('email')).to.eql('some@email.com');
            });

        });

        describe('toObject', function () {

            it('should have public properties', function () {
                var obj = user.toObject();

                expect(obj.name).to.eql(user.get('name'));
                expect(obj.password).to.eql(user.get('password'));
                expect(obj.email).to.eql(user.get('email'));
                expect(obj.url).to.eql(user.get('url'));
            });

            it('should not have private properties', function () {
                var obj = user.toObject();
                expect(obj.resource).to.be(undefined);
            });

        });

        describe('toJSON', function () {

            it('should be the same as toObject', function () {
                var obj = user.toObject();
                var json = user.toJSON();

                expect(JSON.parse(json)).to.eql(obj);
            });

        });

    });

});

