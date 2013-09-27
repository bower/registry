var request = require('request');
var expect  = require('expect.js');

var testHelper = require('../support/test-helper');

var mockData = new testHelper.factories.Info();

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
                expect(res.body.registry).to.eql(mockData.registry);
                done();
            });
        });

        it('should return a \'name\' property', function (done) {
            request.get({
                url: testHelper.url,
                headers: { 'accept': 'application/json' },
                json: true
            }, function (err, res) {
                expect(res.body.name).to.eql(mockData.name);
                done();
            });
        });

        it('should return a \'description\' property', function (done) {
            request.get({
                url: testHelper.url,
                headers: { 'accept': 'application/json' },
                json: true
            }, function (err, res) {
                expect(res.body.description).to.eql(mockData.description);
                done();
            });
        });

    });

});
