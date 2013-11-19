var config = require('../../lib/helpers/config');

var factories = require('./factories');
var mocks = require('./couch-mocks');

var Server = require('../../server/server.js');
var server = new Server(config.app);

// server components
var rootRoutes = require('../../lib/routes/root.js');
var packageRoutes = require('../../lib/routes/package.js');
var userRoutes = require('../../lib/routes/user.js');
var archiveRoutes = require('../../lib/routes/archive.js');

server.applyRoutes(rootRoutes);
server.applyRoutes(packageRoutes);
server.applyRoutes(userRoutes);
server.applyRoutes(archiveRoutes);

server.start(config);

module.exports = {
    factories: factories,
    mocks: mocks,
};
