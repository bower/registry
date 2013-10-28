var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var bcrypt = require('../helpers/bcrypt');
var User = require('../models/user');

passport.use(new BasicStrategy({ qop: 'auth' },
    function (username, password, done) {
        User.load(username)
        .then(function (user) {
            if (!user) {
                return done(null, false);
            }

            return bcrypt.compare(password, user.hash)
            .then(function (result) {
                if (result) {
                    done(null, user, user.hash);
                } else {
                    done(null, false);
                }
            });
        })
        .fail(function (err) {
            done(err);
        });
    },
    function (params, done) {
        // validate nonces as necessary
        done(null, true);
    }
));

module.exports = passport;
