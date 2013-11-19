var request = require('request');
var expect  = require('expect.js');

var mockData = {};

describe('/', function () {

    describe('GET', function () {
        it('should return a 200 response', function (done) {
            request.get({
                url: 'http://localhost:3333/',
                headers: { 'accept': 'application/json' }
            }, function (err, res) {
                expect(res.statusCode).to.eql(200);
                done();
            });
        });

        it.skip('should return a \'registry\' property', function (done) {
            request.get({
                url: 'http://localhost:3333/',
                headers: { 'accept': 'application/json' },
                json: true
            }, function (err, res) {
                expect(res.body.registry).to.eql(mockData.registry);
                done();
            });
        });

        it.skip('should return a \'name\' property', function (done) {
            request.get({
                url: 'http://localhost:3333/',
                headers: { 'accept': 'application/json' },
                json: true
            }, function (err, res) {
                expect(res.body.name).to.eql(mockData.name);
                done();
            });
        });

        it.skip('should return a \'description\' property', function (done) {
            request.get({
                url: 'http://localhost:3333/',
                headers: { 'accept': 'application/json' },
                json: true
            }, function (err, res) {
                expect(res.body.description).to.eql(mockData.description);
                done();
            });
        });

    });

});
