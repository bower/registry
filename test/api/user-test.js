var request = require('request');
var expect  = require('expect.js');

var testHelper = require('../support/test-helper');

var user = new testHelper.factories.User();

describe('/users/:name', function () {
    describe('GET', function () {
        it.skip('should respond with a user', function (done) {
            request.get({
                url: testHelper.url + 'users/test'
            }, function (err, res) {
                expect(res.statusCode).to.eql(200);
                done();
            });
        });
    });

    describe('PUT', function () {
        it.skip('should create a user', function (done) {
            request.put({
                headers: {'content-type' : 'application/json'},
                url: testHelper.url + 'users/test',
                body: JSON.stringify(user),
                json: true
            }, function (err, res) {
                expect(res.statusCode).to.eql(201);
                done();
            });
        });

        it.skip('should conflict upon creating an existing user', function (done) {
            request.put({
                headers: {'content-type' : 'application/json'},
                url: testHelper.url + 'user/test',
                body: JSON.stringify(user)
            }, function (err, res) {
                expect(res.statusCode).to.eql(409);
                done();
            });
        });
    });

    describe('UPDATE', function () {
        it.skip('should create a user', function (done) {
            request.update({
                headers: {'content-type' : 'application/json'},
                url: testHelper.url + 'user/' + user.name
            }, function (err, res) {
                expect(res.statusCode).to.eql(200);
                done();
            });
        });
    });

    describe('DELETE', function () {
        it.skip('should create a user', function (done) {
            request.del({
                headers: {'content-type' : 'application/json'},
                url: testHelper.url + 'user/' + user.name
            }, function (err, res) {
                expect(res.statusCode).to.eql(200);
                done();
            });
        });
    });
});

