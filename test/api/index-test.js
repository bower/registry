var request = require('request');
var expect  = require('expect.js');
var testHelper = require('../support/test-helper');

var regInfo = new testHelper.factories.info();

describe('/', function () {

  describe('GET', function () {

    it('should return a 200 response', function (done) {
      request.get({
        url: testHelper.url,
        headers: { 'accept': 'application/json' }
      }, function (err, res) {
        expect(res.statusCode).to.eql(200);
        done();
      });
    });

    it('should response with a version number', function (done) {
      request.get({
        url: testHelper.url,
        headers: { 'accept': 'application/json' }
      }, function (err, res) {
        expect(res.body).to.eql(regInfo);
        done();
      });
    });

    it('should respond with a description', function (done) {
      request.get({
        url: testHelper.url,
        headers: { 'accept': 'application/json' }
      }, function () {
        done();
      });
    });

  });

});
