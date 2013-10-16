var couchapp = require('couchapp');
var couch = require('./helpers/couch');
var Q = require('q');

var docs = require('./../couchapp/ddocs');

var registry = {
    configure: function (options) {
        this.options = options;
        couch.connect(options.db);

        // This require just initialises the search index
        require('../lib/helpers/search');

        var destroy = Q.denodeify(couch.host.db.destroy);
        var promise = new Q();

        // if temporary, destroy DB before it's created.
        if (options.db.temporary) {
            promise = destroy(options.db.name)
            .fail(function () {}); // We can get an error if the db doesn't already exist. But we don't care.
        }

        return promise
        .then(this.createDatabase.bind(this));
    },

    //destroy registry db
    teardown: function () {
        var deferred = Q.defer();

        couch.host.db.destroy(registry.options.db.name, function () {
            deferred.resolve();
        });

        return deferred.promise;
    },

    // create given db and insert design documents
    createDatabase: function () {
        var deferred = Q.defer();

        var options = this.options;

        couch.host.db.create(options.db.name, function () {
            docs.forEach(function (doc, index) {
                couchapp.createApp(doc, couch.url + '/' + options.db.name, function (app) {
                    app.push(function () {
                        if (index >= docs.length - 1) {
                            deferred.resolve();
                        }
                    });
                });
            });
        });

        return deferred.promise;
    }
};

module.exports = registry;
