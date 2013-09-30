var Package = require('../models/package');
var registry = require('../registry');
var Q = require('q');

//  A super-duper array of models
var Packages = function (models) {
    this.length = 0;

    this.reset(models);
};

Packages.prototype = [];

Packages.prototype.constructor = Packages;

Packages.prototype.reset = function (models) {

    models = models || [];

    this.splice(0, this.length);

    for (var i = 0; i < models.length; i++) {
        if (models[i] instanceof Package) {
            this[i] = models[i];
        } else {
            this[i] = new Package(models[i]);
        }
    }

    this.length = models.length;
};

Packages.prototype.resetQuery = function (query) {
    var collection = this;

    return query.then(function (data) {
        collection.reset(data.rows.map(function (document) {
            return document.doc || document.value;
        }));
        return Q.resolve(collection);
    });
};

Packages.prototype.toArray = function () {
    return this.map(function (model) {
        return model.toObject();
    });
};


// return all packages
// @param {boolean} orderDescending
Packages.prototype.all = function (orderDescending) {
    var query = registry.view('packages', 'byDate', {
        descending: !!orderDescending
    });

    return this.resetQuery(query);
};


// search for specific package.
// @param {string} packageName The name of a package.
Packages.prototype.search = function (name) {
    var query = registry.search('packages', 'packages', {
        q: name
    });

    return this.resetQuery(query);
};


// fetch packages.
// @param {integer} packageId The id a package.
// @param {object}
Packages.prototype.fetch = function (ids, params) {
    if (typeof ids === 'string') {
        ids = [ids];
    }

    var args = [{
        keys: ids
    }];

    if (params) {
        args.push(params);
    }

    var query = registry.fetch.apply(args);
    return this.resetQuery(query);
};

module.exports = Packages;
