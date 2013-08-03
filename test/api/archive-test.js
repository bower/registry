var request = require('request');
var expect  = require('expect.js');
var testHelper = require('../support/test-helper');

describe('/archive/:name/:version', function () {

  describe('GET', function () {

    it.skip('should return a 200 response', function (done) {
      request.get({
        url: testHelper.url + 'archive/name',
        headers: { 'accept': 'application/json' }
      }, function (err, res) {
        expect(res.statusCode).to.eql(200);
        done();
      });
    });

    it.skip('should respond with archive info', function (done) {
      request.put({
        headers: {'content-type' : 'application/json'},
        url: testHelper.url + 'archive/name',
        body: 'somezipfile'
      }, function (err, res) {
        expect(res.statusCode).to.eql(201);
        done();
      });

    });

  });

  describe('PUT', function () {

    it.skip('should create an archive', function (done) {
      request.put({
        headers: {'content-type' : 'application/json'},
        url: testHelper.url + 'archive/name',
        body: 'somezipfile'
      }, function (err, res) {
        expect(res.statusCode).to.eql(201);
        done();
      });

    });

  });

});
