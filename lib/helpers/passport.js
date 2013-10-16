var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var Couch = require('../helpers/couch');
var bcrypt = require('../helpers/bcrypt');
var database = new Couch('users');

passport.use(new BasicStrategy({ qop: 'auth' },
    function (username, password, done) {
        database.get(username)
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
            if (err) { return done(err); }
        });
    },
    function (params, done) {
        console.log('baz');
        console.log(params);
        // validate nonces as necessary
        done(null, true);
    }
));

module.exports = passport;
