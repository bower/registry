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

    it('should return a \'registry\' property', function (done) {
      request.get({
        url: testHelper.url,
        headers: { 'accept': 'application/json' },
        json: true
      }, function (err, res) {
        expect(res.body.registry).to.eql(regInfo.registry);
        done();
      });
    });

    it('should return a \'name\' property', function (done) {
      request.get({
        url: testHelper.url,
        headers: { 'accept': 'application/json' },
        json: true
      }, function (err, res) {
        expect(res.body.name).to.eql(regInfo.name);
        done();
      });
    });

    it('should return a \'description\' property', function (done) {
      request.get({
        url: testHelper.url,
        headers: { 'accept': 'application/json' },
        json: true
      }, function (err, res) {
        expect(res.body.description).to.eql(regInfo.description);
        done();
      });
    });

  });

});
