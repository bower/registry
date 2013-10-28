var User = require('../../lib/models/user');
var expect = require('expect.js');

User.prototype.database = {}; // Mock!

describe('User model', function () {
    it('accepts valid properties in the constructor', function () {
        var user = new User({
            name: 'testuser',
            email: 'test@example.com',
            url: 'http://example.com',
            hash: '0123456789abcdef'
        });

        expect(user.name).to.be('testuser');
        expect(user.email).to.be('test@example.com');
        expect(user.url).to.be('http://example.com');
        expect(user.hash).to.be('0123456789abcdef');
    });

    it('ignores junk properties in the constructor', function () {
        var user = new User({
            dave: 'testuser',
            unicorns: 'UNICRONS!!!',
            password: 'hunter12',
            packages: ['jquery', 'underscore']
        });

        expect(user.dave).to.be(undefined);
        expect(user.unicorns).to.be(undefined);
        expect(user.password).to.be(undefined);
        expect(user.packages).to.be(undefined);
    });

    it('should not leak the password hash', function () {
        var user = new User();
        user.hash = 'foo';

        expect(user.toClient().hash).to.be(undefined);
    });

    it('hashes the password', function (done) {
        var user = new User();
        user.setPassword('foo')
        .then(function () {
            expect(user.hash.length).to.be(60);
        })
        .done(done);
    });

    it('fails if the password is blank', function (done) {
        var user = new User();
        user.setPassword('')
        .then(function () {
            expect.fail('blank password was accepted');
        }, function (error) {
            expect(error).to.be.an(Error);
            expect(error.message).to.be('Password cannot be blank');
        })
        .done(done);
    });
});
