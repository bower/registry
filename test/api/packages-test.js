var request = require('request');
var expect  = require('expect.js');
var testHelper = require('../support/test-helper');

var pkg = new testHelper.factories.package();

describe('/packages', function () {

  describe('GET', function () {


    it.skip('should respond with a list of packages', function (done) {
      request.get({
        url: testHelper.url + 'packages',
        headers: { 'accept': 'application/json' }
      }, function (err, res) {
        expect(res.statusCode).to.eql(200);
        done();
      });
    });

  });

});

describe('/packages/:name', function () {

  describe('GET', function () {

    it.skip('should respond with a single package', function (done) {
      request.get({
        url: testHelper.url + 'packages/test',
        headers: { 'accept': 'application/json' }
      }, function (err, res) {
        expect(res.statusCode).to.eql(200);
        expect(res.body).to.eql(pkg);
        done();
      });

    });

  });

});



