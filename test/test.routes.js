var request = require('request');
var assert = require('assert');

//Simple test to see if the route response is what we expect
it('Status code should be ok', function (done) {
  request.get('http://localhost:8080/status', function (err, res, body){
    console.log(res.statusCode);
    assert.equal(200, res.statusCode);
    done();
  });
});
