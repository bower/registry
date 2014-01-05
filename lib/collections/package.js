var database = require('../helpers/database');
var searchIndex = require('../helpers/search');
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
    return database.view('packages', 'all', {
        'include_docs': true
    })
    .then(function (result) {
        var packages = result.rows.map(function (row) {
            return new Package(row.doc);
        });

        return new PackageCollection(packages);
    });
};

PackageCollection.search = function (query) {
    return searchIndex.search(query)
    .map(function (result) {
        return Package.load(result.ref)
        .then(function (pkg) {
            return pkg.toClient();
        });
    });
};

PackageCollection.all()
.then(function (collection) {
    collection.packages.forEach(function (pkg) {
        searchIndex.add({
            name: pkg.name,
            description: pkg.description,
            keywords: pkg.keywords.join(' '),
            owners: pkg.owners.join(' '),
            id: pkg.name
        });
    });

    console.log('Finished indexing');
});

module.exports = PackageCollection;
