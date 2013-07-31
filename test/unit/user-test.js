var User = require('../../lib/models/user');
var expect = require('expect.js');
var ddocs = require('../../couchapp/ddocs.js');
var mocks = require('../support/couch-mocks');

var testHelper = require('../support/test-helper');

var registry = testHelper.registry;
var mockData = {
  name: 'thename',
  password: 'somepassword',
  email: 'some@email.com',
  url: 'https://github.com/bower/registry.git'
};

mocks(registry.url(), testHelper.opts, ddocs);

describe('User', function () {

  beforeEach(function (done) {

    registry.promise.then(function () {
      done();
    });

  });

  describe('Model', function () {

    beforeEach(function () {
      this.user = new User(registry, mockData);
    });

    describe('Constructor', function () {

      it('should be an instance of User', function () {
        expect(this.user).to.be.a(User);
      });

      it('should have normal exposed props', function () {
        expect(this.user.registry).to.eql(registry);
        expect(this.user._model).to.be.a(Object);
      });

    });

    describe('Property initialization and retrieval', function () {

      it('should happen on construction', function () {
        expect(this.user.get('name')).to.eql(mockData.name);
        expect(this.user.get('password')).to.eql(mockData.password);
        expect(this.user.get('email')).to.eql(mockData.email);
        expect(this.user.get('url')).to.eql(mockData.url);
      });

    });

    describe('Property assignment', function () {

      it('should work using .set()', function () {
        this.user.set('email', 'some@email.com');
        expect(this.user.get('email')).to.eql('some@email.com');
      });

    });

    describe('toObject', function () {

      it('should have public properties', function () {
        var obj = this.user.toObject();

        expect(obj.name).to.eql(this.user.get('name'));
        expect(obj.password).to.eql(this.user.get('password'));
        expect(obj.email).to.eql(this.user.get('email'));
        expect(obj.url).to.eql(this.user.get('url'));
      });

      it('should not have private properties', function () {
        var obj = this.user.toObject();
        expect(obj.resource).to.be(undefined);
      });

    });

    describe('toJSON', function () {

      it('should be the same as toObject', function () {
        var obj = this.user.toObject();
        var json = this.user.toJSON();

        expect(JSON.parse(json)).to.eql(obj);
      });

    });

  });

});

