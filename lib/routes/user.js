var passport = require('../helpers/passport');
var User = require('../models/user');

var errorhandler = function (res, error) {
    res.send({
        'error': error.message
    });
};

module.exports = function (app) {
    app.get('/users/:name', function (req, res) {
        return User.load(req.params.name)
        .then(function (user) {
            res.send(user.toClient());
        })
        .fail(errorhandler.bind(null, res));
    });

    app.post('/users/', function (req, res) {
        var user = new User();
        user.update(req.body);
        user.setPassword(req.body.password)
        .then(function () {
            return user.save();
        })
        .then(function () {
            res.send({
                ok: 'User ' + user.name + ' created'
            });
        })
        .fail(errorhandler.bind(null, res));
    });

    app.put('/users/:name', passport.authenticate('basic', { session: false }), function (req, res) {
        User.load(req.params.name)
        .then(function (user) {
            if (user.name !== req.user.name) {
                throw new Error('You can only update yourself');
            }
            return user;
        }, function () {
            // Looks like the user didn't already exist. This is fine.
            return new User();
        })
        .then(function (user) {
            user.update(req.body);

            return user.setPassword(req.body.password)
            .then(function () {
                return user.save();
            })
            .then(function () {
                res.send({
                    ok: 'User ' + user.name + ' saved'
                });
            });
        })
        .fail(errorhandler.bind(null, res));
    });

    app.del('/users/:name', passport.authenticate('basic', { session: false }), function (req, res) {
        User.load(req.params.name)
        .then(function (user) {
            if (user.name !== req.user.name) {
                throw new Error('You can only delete yourself');
            }

            return user.destroy()
            .then(function () {
                res.send({
                    ok: 'User ' + user.name + ' deleted'
                });
            });
        })
        .fail(errorhandler.bind(null, res));
    });
};
