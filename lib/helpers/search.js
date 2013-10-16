var PackageCollection = require('../collections/package');
var lunr = require('lunr');

var index = lunr(function () {
    this.field('name');
    this.field('description');
    this.field('keywords');
    this.field('owners');
});

PackageCollection.all()
.then(function (collection) {
    collection.packages.forEach(function (pkg) {
        index.add({
            name: pkg.name,
            description: pkg.description,
            keywords: pkg.keywords.join(' '),
            owners: pkg.owners.join(' '),
            id: pkg.name
        });
    });

    console.log('Finished indexing');
});

module.exports = index;
