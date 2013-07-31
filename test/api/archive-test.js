var request = require('request');
var expect  = require('expect.js');
var testHelper = require('../support/test-helper');

describe('/archive/:name/:version', function () {

  describe('PUT', function () {

    it.skip('should create a user', function (done) {
      request.put({
        headers: {'content-type' : 'application/json'},
        url: testHelper.url + 'user/test',
        body: 'somezipfile'
      }, function (err, res) {
        expect(res.statusCode).to.eql(201);
        done();
      });

    });

  });

});
