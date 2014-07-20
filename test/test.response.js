var request = require('request');
var should = require('chai').should();
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

    describe('headers', function() {
        // Simple test to see if the route response is what we expect
        it('should support CORS headers', function (done) {
            request.get('http://localhost:' + PORT + '/status', function (err, res, body){
                should.exist(res.headers['access-control-allow-origin']);
                done();
            });
        });
    });
});
