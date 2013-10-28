var Couch = require('./couch');
var config = require('./config');
var nano = require('nano');

module.exports = new Couch(nano(config.couch), config.database);
