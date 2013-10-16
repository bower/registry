var passport = require('../helpers/passport');
var Package = require('../models/package');
var Readable = require('stream').Readable;
var Q = require('q');
var Couch = require('../helpers/couch');
var database = new Couch('packages');

var errorhandler = function (res, error) {
    res.send({
        'error': error
    });
};

module.exports = function (app) {
    app.get('/archives/:name', function (req, res, next) {
        Package.load(req.params.name)
        .fail(function (error) {
            throw new Error('No such package "' + req.params.name + '"');
        })
        .then(function (pkg) {
            if (pkg.versions.length > 0) {
                res.redirect('/archives/' + pkg.name + '/' + pkg.getLatest());
                res.send();
            } else {
                return Q.reject(new Error('No available versions of "' + pkg.name + '" found'));
            }
        })
        .fail(errorhandler.bind(null, res));
    });

    app.get('/archives/:name/:version', function (req, res) {
        database.attachmentGetStream(req.params.name, req.params.version)
        .pipe(res);
    });

    app.put('/archives/:name/:version', passport.authenticate('basic', { session: false }), function (req, res) {
        Package.load(req.params.name)
        .then(function (pkg) {
            if (!pkg.ownedBy(req.user.name)) {
                throw new Error('You can only add archives for packages you own');
            }

            return pkg.addArchive(new Readable().wrap(req), req.params.version);
        })
        .then(function (result) {
            res.send({
                ok: 'Successfully added version "' + req.params.version + '" archive of "' + req.params.name + '"'
            });
        })
        .fail(errorhandler.bind(null, res));
    });

};
