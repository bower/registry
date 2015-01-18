/*jshint expr: true*/

process.env.NODE_ENV = 'test';

var request = require('request');
var FormData = require('form-data');
var expect = require('chai').expect;
var spawn = require('child_process').spawn;

var config = require('config');

var bowerServerUrl = 'http://localhost:' + config.get('port');

describe('registry server', function(){
    var server = null;

    before(function(done){
        // Ensure time for integration tests
        this.timeout(5000);

        server = spawn('node', ['index.js']);
        server.stdout.on('data', function(data){
            if (data.toString().match('ready')) {
                done();
            }
        });

    });

    after(function(){
        server.kill();
    });

    describe('headers', function() {
        it('should support CORS', function (done) {
            request.get(bowerServerUrl + '/status', function (err, res, body){
                expect(res.headers['access-control-allow-origin']).not.to.be.null;
                done();
            });
        });
    });

    describe('routes', function() {
        describe('/status', function() {
            it('should return 200 when server is running', function (done) {
                request.get(bowerServerUrl + '/status', function (err, res, body){
                    expect(res.statusCode).to.equal(200);
                    done();
                });
            });
        });

        describe('/packages', function() {
            it('should return 500/database error before psql is setup', function (done) {
                request.get(bowerServerUrl + '/packages', function (err, res, body){
                    expect(res.statusCode).to.equal(500);
                    done();
                });
            });
        });
    });

    describe('server', function(){
        // curl -F uses multipart, we want to make sure we keep curl functionality
        it('should support curl', function (done) {
            // code checks github to make sure the url is valid, we should give it some time.
            var form = new FormData();
            form.append('url', 'notvalid');
            form.append('name','jquery');
            form.submit(bowerServerUrl + '/packages', function(err, res) {
                // We expect a 400 because it is an invalid url and the db is not setup
                // We get a 500 if multipart is not instantiated in index
                expect(res.statusCode).to.equal(400);
                done();
            });
        });
    });
});
