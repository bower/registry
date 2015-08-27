var config = require('config');
var memjs = require('memjs');

var client = memjs.Client.create(config.get('memcached.servers').join(','), {
    username: config.get('memcached.username'),
    password: config.get('memcached.password')
});

client.delete('packages');

module.exports = client;
