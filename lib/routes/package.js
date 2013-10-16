var Q = require('q');
var passport = require('../helpers/passport');
var PackageCollection = require('../collections/package');
var Package = require('../models/package');
var searchIndex = require('../helpers/search');

var errorhandler = function (res, error) {
    res.send({
        'error': error
    });
};

module.exports = function (app) {
    app.get('/packages', function (req, res) {
        PackageCollection.all()
        .then(function (collection) {
            res.send(collection.toClient());
        })
        .fail(errorhandler.bind(null, res));
    });

    app.get('/packages/search/:query', function (req, res) {
        res.send(searchIndex.search(req.params.query));
    });

    app.get('/packages/:name', function (req, res) {
        var names = req.params.name.split(',');
        var promises = names.map(function (name) {
            return Package.load(name);
        });

        Q.all(promises)
        .then(function (packages) {
            if (packages.length === 1) {
                res.send(packages[0].toClient());
            } else {
                res.send(new PackageCollection(packages).toClient());
            }
        })
        .fail(errorhandler.bind(null, res));
    });

    app.post('/packages', passport.authenticate('basic', { session: false }), function (req, res) {
        var pkg = new Package();
        pkg.update(req.body);
        pkg.addOwner(req.user.name);
        pkg.save()
        .then(function () {
            res.send({
                ok: 'Package ' + pkg.name + ' created'
            });
        })
        .fail(errorhandler.bind(null, res));
    });

    app.put('/packages/:name', passport.authenticate('basic', { session: false }), function (req, res) {
        Package.load(req.params.name)
        .fail(function () {
            // Looks like the package didn't already exist. This is fine.
            var pkg = new Package();
            pkg.addOwner(req.user.name);
            return pkg;
        })
        .then(function (pkg) {
            if (!pkg.ownedBy(req.user.name)) {
                throw new Error('You can only update packages you own');
            }

            pkg.update(req.body);

            return pkg.save()
            .then(function () {
                res.send({
                    ok: 'Package ' + pkg.name + ' saved'
                });
            });
        })
        .fail(errorhandler.bind(null, res));
    });

    app.del('/packages/:name', passport.authenticate('basic', { session: false }), function (req, res) {
        Package.load(req.params.name)
        .then(function (pkg) {
            if (!pkg.ownedBy(req.user.name)) {
                throw new Error('You can only delete packages you own');
            }

            return pkg.destroy()
            .then(function () {
                res.send({
                    ok: 'Package ' + pkg.name + ' deleted'
                });
            });
        })
        .fail(errorhandler.bind(null, res));
    });
};
