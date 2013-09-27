//
// helpers/passport
//

var DigestStrategy = require('passport-http').DigestStrategy;

module.exports = function (passport) {

    return function (req, res, next) {

        passport.use(new DigestStrategy({ qop: 'auth' },

            function (username, done) {
                //var user = new registry.User.find(username);
                console.log(username);
                done();
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

