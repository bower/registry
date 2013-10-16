var Couch = require('../helpers/couch');
var database = new Couch('packages');
var Package = require('../models/package');

var PackageCollection = function (packages) {
    this.packages = packages;
};

PackageCollection.prototype.toClient = function () {
    return {
        total: this.length,
        packages: this.packages.map(function (pkg) {
            return pkg.toClient();
        }),
        page: 1
    };
};

PackageCollection.all = function () {
    return database.view('search', 'all', {
        'include_docs': true
    })
    .then(function (result) {
        var packages = result.rows.map(function (row) {
            return new Package(row.doc);
        });

        return new PackageCollection(packages);
    });
};

module.exports = PackageCollection;
