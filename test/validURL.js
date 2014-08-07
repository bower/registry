var assert = require('chai').assert;
var validURL = require('../lib/validURL');


describe('validURL', function(){

      it('should should recognize valid url', function (done) {

            validURL('git://github.com/bower/registry.git', function (status) {
                  assert.isTrue(status);

                  done();
            });

      });

      it('should should recognize invalid url', function (done) {

            validURL('git://github.com/bower/lololo', function (status) {
                  assert.isFalse(status);

                  done();
            });

      });

      it('should should not allow script injection', function (done) {

            validURL('git://github.com/bower/lololo; true', function (status) {
                  assert.isFalse(status);

                  done();
            });

      });
});
