var request = require('request');
var assert = require('chai').assert;
var spawn = require('child_process').spawn;
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
    });
});
