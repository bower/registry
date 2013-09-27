var bcrypt = require('bcrypt');
var Q = require('q');
var SALT_WORK_FACTOR = 10;

// generate hashed password
var generate = function (password) {

    var dfd = Q.defer();

    if (!password) {
        dfd.reject(new Error('missing argument'));
    }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            dfd.reject(err);
        }

        // hash the password using our new salt
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                dfd.reject(err);
            }

            // override the cleartext password with the hashed one
            password = hash;
            dfd.resolve(password);
        });

    });

    return dfd.promise;

};

// compare given password with another
var compare = function (src, target) {
    var dfd = Q.defer();

    if (!src || !target) {
        dfd.reject(new Error('missing argument'));
    }

    bcrypt.compare(src, target, function (isMatch) {
        if (!isMatch) {
            dfd.reject(new Error('not matching'));
        }

        dfd.resolve(isMatch);
    });

    return dfd.promise;
};

module.exports = {
    generate: generate,
    compare: compare
};
