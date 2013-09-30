var couchapp = require('couchapp');
var nano = require('nano');
var Q = require('q');

var docs = require('./../couchapp/ddocs');
var deferred = Q.defer();

var registry = {
    promise: deferred.promise,

    then: deferred.promise.then,

    configure: function (options) {
        this.options = options;

        var url = this.url(options);
        var couch = this.couch = nano(this.url());

        this.modules = {};

        // create given db and insert design documents
        function createAppDB() {
            couch.db.create(options.db.name, function () {
                docs.forEach(function (doc, index) {
                    couchapp.createApp(doc, url + '/' + options.db.name, function (app) {
                        app.push(function () {
                            if (index >= docs.length - 1) {
                                deferred.resolve(couch.use(options.db.name));
                            }
                        });
                    });
                });
            });
        }

        // if temporary, destroy DB before it's created.
        if (options.db.temporary) {
            couch.db.destroy(options.db.name, function () {
                createAppDB();
            });
        } else {
            createAppDB();
        }
    },

    // construct db uri
    url: function (opts) {

        var options = opts || this.options;

        var protocol = options.db.https ? 'https' : 'http' + '://';
        var credentials = options.db.username || '';
        var host = options.db.host;

        if (options.db.password) {
            credentials += ':' + options.db.password;
        }

        if (credentials) {
            credentials += '@';
        }

        if (options.db.port) {
            host += ':' + options.db.port;
        }

        return protocol + credentials + host;
    },

    //destroy registry db
    teardown: function () {
        return this.promise.then(function () {
            var deferred = Q.defer();

            registry.couch.db.destroy(registry.options.db.name, function () {
                deferred.resolve();
            });

            return deferred.promise;
        });
    }

};

// make db methods
(function () {

    var dbFunctions = {
        get: function (db, key) {
            var deep = key.split('.');
            var fn = db;

            for (var i = 0; i < deep.length; i++) {
                fn = fn[deep[i]];
            }

            return fn;
        },
        make: function (proto, key, fn) {
            var root = proto;
            var deep = key.split('.');
            var level = deep.length;

            deep.forEach(function (prop) {
                level--;
                // end of the road? assign the fn
                if (level < 1) {
                    root[prop] = fn;
                    return;
                }
                // make sure it's an object
                root[prop] = root[prop] || {};
                // update the root
                root = root[prop];
            });
        }
    };

    var dbMethods = ['insert', 'get', 'head', 'copy', 'bulk', 'list', 'fetch', 'view', 'show',
        'atomic', 'destroy', 'attachment.insert', 'attachment.get', 'attachment.destroy'];

    dbMethods.forEach(function (functionName) {
        dbFunctions.make(registry, functionName, function () {
            var args = [].slice.call(arguments);

            return this.promise.then(function (db) {
                var fn = dbFunctions.get(db, functionName);
                var deferred = Q.defer();
                var callback = args[args.length - 1];

                args[args.length] = function (err) {
                    // if old-school callback was supplied…
                    if (typeof callback === 'function') {
                        callback.apply(this, arguments);
                    }

                    if (err) {
                        deferred.reject(err);
                        return;
                    }

                    deferred.resolve.apply(deferred.resolve, [].slice.call(arguments, 1));
                    return;
                };

                fn.apply(db, args);

                return deferred.promise;
            });
        });
    });
}());

module.exports = registry;
