var request = require('request');
var assert = require('chai').assert;
var spawn = require('child_process').spawn;
var database = require('../lib/database');
var PORT = 8080;


describe('registry server', function(){
    var server = null;

    before(function(done){
        process.env.PORT = PORT;
        server = spawn('node', ['index.js']);
        server.stdout.on('data', function(data){
            if (data.toString() === 'ready.\n') {
                done();
            }
        });
    });

    after(function(){
        server.kill();
    });

    describe('routes', function() {
        // Simple test to see if the route response is what we expect
        it('should support /status', function (done) {
            request.get('http://localhost:' + PORT + '/status', function (err, res, body){
                assert.equal(200, res.statusCode);
                done();
            });
        });

        it('should not create a package when an invalid URL is provided', function (done) {
            request.post({
              url: 'http://localhost:' + PORT + '/packages',
              form: { 'name': 'jquery', 'url': 'jquery.com' }},
              function (err, res, body){
                assert.equal(400, res.statusCode);
                done();
            });
        });

        it('should create a package when POSTing to /packages', function (done) {
            request.post({
              url: 'http://localhost:' + PORT + '/packages',
              form: { 'name': 'jquery', 'url': 'git://github.com/jquery/jquery.git' }},
              function (err, res, body){
                console.log(body);
                assert.equal(201, res.statusCode);
                done();
            });
        });

        it('should allow searches by GETting /packages/search/:name', function (done) {
          request.get('http://localhost:' + PORT + '/packages/search/jquery', function (err, res, body){
              assert.equal(200, res.statusCode);
              assert.equal('[\n  {\n    "name": "jquery",\n    "url": "git://github.com/jquery/jquery.git"\n  }\n]', body);
              done();
          });
        });

        it('should error when a package has already been registered', function (done) {
          request.post({
              url: 'http://localhost:' + PORT + '/packages',
              form: { 'name': 'jquery', 'url': 'git://github.com/jquery/jquery.git' }},
              function (err, res, body){
                  assert.equal(406, res.statusCode);
                  done();
              });
          });

    });
});
