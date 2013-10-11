var DigestStrategy = require('passport-http').DigestStrategy;

var User = require('../models/user');

module.exports = function (passport) {
    return function (req, res, next) {
        passport.use(new DigestStrategy({ qop: 'auth' },
            function (username, done) {

                var user = new User({
                    name: username
                });

                user.find(username)
                .then(function (data) {
                    if (!data) { return done(null, false); }
                })
                .fail(function (err) {
                    if (err) { return done(err); }
                });

                return done(null, user.toJSON(), user.toJSON().password);
            },
            function (params, done) {
                console.log(params);
                // validate nonces as necessary
                done(null, true);
            }
        ));
        next();
    };
};
