/*global before:true, after:true*/

var opts = require('../../config/testing.json');
var factories = require('./factories');
var url = opts.app.https ? 'https' : 'http' +  '://' + opts.app.host + ':' + opts.app.port + '/';

var Server = require('../../server/server.js');
var mocks = require('./couch-mocks');
var ddocs = require('../../couchapp/ddocs');

var registry = require('../../lib/registry');
var promise = registry.configure(opts)
.then(function () {
    var server = new Server(opts.app);
    // server components
    var rootRoutes = require('../../lib/routes/root.js');
    var packageRoutes = require('../../lib/routes/package.js');
    var userRoutes = require('../../lib/routes/user.js');

    server.applyRoutes(rootRoutes);
    server.applyRoutes(packageRoutes);
    server.applyRoutes(userRoutes);

    server.start(opts);
}, function (err) {
    console.log(err, err.stack);
});

module.exports = {
    before: (function () {

        before(function (done) {
            promise.then(done);
        });

    }()),
    beforeEach: (function () {

        beforeEach(function () {});

    }()),
    afterEach: (function () {

        afterEach(function () {});

    }()),
    after: (function () {

        after(function () {});

    }()),
    url: url,
    factories: factories,
    registry: registry,
    opts: opts,
    mocks: mocks,
    ddocs: ddocs
};
