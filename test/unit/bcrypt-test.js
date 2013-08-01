//
// test/unit/bcrypt-test
//

var helper = require('../../lib/helpers/bcrypt');
var expect = require('expect.js');

var pwd = null;
var fakePwd = 'XOqLEXgvnIw.brWa9BQZzuY9s';

describe('bcrypt Helper', function () {


  describe('Methods', function () {

    it('exposes a generate method', function () {
      expect(helper).to.have.property('generate');
    });

    it('exposes a compare method', function () {
      expect(helper).to.have.property('compare');
    });

    describe('#generate', function () {

      it('should fail if only 1 param is provided', function (done) {
        helper.generate('sss').then(function (password) {
          pwd = password;
          expect(password).to.be.ok;
          done();
        });
      });

    });

    describe('#compare', function () {

      it('requires at least 2 params to run', function () {
        helper.compare('sss', this.pw).then(function (match) {
          expect(match).to.be.an(Boolean);
          expect(match).to.be.ok();
        });
      });

      it('should fail if only 1 param is provided', function () {
        helper.compare('sss', '').fail(function (err) {
          expect(err).to.be.ok();
          expect(err.message).to.eql('missing argument');
          expect(err).to.be.an(Error);
        });
      });

      it('should fail if 2nd param is not a hash', function () {
        helper.compare('sss', 'sss').then(function (err) {
          expect(err).to.be.ok;
          expect(err.message).to.eql('missing argument');
          expect(err).to.be.an(Error);
        });
      });

      it('should fail if 2nd param is incorrect', function () {
        helper.compare('sss', fakePwd).then(function (err) {
          expect(err).to.be.ok;
          expect(err.message).to.eql('not matching');
          expect(err).to.be.an(Error);
        });
      });

    });

  });

});
