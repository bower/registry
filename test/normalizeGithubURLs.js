var assert = require('chai').assert;
var normalizeURL = require('../lib/normalizeURL');
var normalizedURL = 'git://github.com/bower/Bower.git';


describe('package names', function(){

    it('should support git urls with no extension', function () {
        return assert.equal(normalizeURL('git://github.com/bower/Bower'), normalizedURL);
    });

    it('should support git urls with extensions', function () {
        return assert.equal(normalizeURL('git://github.com/bower/Bower.git'), normalizedURL);
    });

    it('should support urls with www subdomain', function () {
        return assert.equal(normalizeURL('git://www.github.com/bower/Bower.git'), normalizedURL);
    });

    it('should support http urls', function () {
        return assert.equal(normalizeURL('http://github.com/bower/Bower.git'), normalizedURL);
    });

    it('should support https urls', function () {
        return assert.equal(normalizeURL('https://github.com/bower/Bower.git'), normalizedURL);
    });

    it('should support url with a trailing slash and no extension', function () {
        return assert.equal(normalizeURL('https://github.com/bower/Bower/'), normalizedURL);
    });

    it('should support url with a trailing slash and an extension', function () {
        return assert.equal(normalizeURL('https://github.com/bower/Bower.git/'), normalizedURL);
    });

    it('should support http(s) urls with basic-auth username', function () {
        return assert.equal(normalizeURL('https://bower@github.com/bower/Bower.git'), normalizedURL);
    });

    it('should support http(s) urls with basic-auth username and password', function () {
        return assert.equal(normalizeURL('https://bower:bower@github.com/bower/Bower.git'), normalizedURL);
    });

    it('should support ssh urls', function () {
        return assert.equal(normalizeURL('git@github.com:bower/Bower.git'), normalizedURL);
    });

    it('should support ssh urls with a preceeding slash', function () {
        return assert.equal(normalizeURL('git@github.com:/bower/Bower.git'), normalizedURL);
    });

    it('should support urls with dots in the name and an extension', function () {
        return assert.equal(normalizeURL('https://github.com/bower/Bower.js.git'), 'git://github.com/bower/Bower.js.git');
    });

    it('should not work on gists', function () {
        return assert.equal(normalizeURL('https://gist.github.com/bower/6161572'), 'https://gist.github.com/bower/6161572');
    });

    it('should not work other urls', function () {
        return assert.equal(normalizeURL('https://bitbucket.org/bower/Bower.git'), 'https://bitbucket.org/bower/Bower.git');
    });

});
