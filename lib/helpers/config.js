var _ = require('lodash');
var url = require('url');

var config = {
    'app': {
        'port': 3333,
        'https': false,
        'host': 'localhost',
        'ssl': {
            'key' : 'config/cert/key.pem',
            'cert' : 'config/cert/certificate.pem'
        }
    },
    'couch': 'http://localhost:5984',
    'database': 'bower',
    'update': function (options) {
        if (options.couch) {
            var original = url.parse(this.couch);
            var updated = url.parse(options.couch);

            updated.protocol = updated.protocol || original.protocol;
            updated.hostname = updated.hostname || original.hostname;
            updated.port = updated.port || original.port;

            options.couch = url.format(updated);
        }

        _.extend(this, options);
    }
};

module.exports = config;
