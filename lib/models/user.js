var util = require('util');
var bcrypt = require('../helpers/bcrypt');
var Couch = require('../helpers/couch');
var Model = require('./model');
var database = new Couch('users');
var packageDatabase = new Couch('packages');
var Q = require('q');

var fields = {
    name: {couch: true, client: true},
    email: {couch: true, client: true},
    url: {couch: true, client: true},
    hash: {couch: true},
    packages: {client: true}
};

var User = function (data) {
    Model.call(this, fields, data);

    Object.seal(this);
};

util.inherits(User, Model);

User.prototype.type = 'user';
User.prototype.database = database;

User.prototype.update = function (data) {
    // Setting password is a separate call

    if (data.name && this.name && data.name !== this.name) {
        throw new Error('Cannot rename a user');
    }

    this.name = this.name || data.name;
    this.email = data.email || this.email || '';
    this.url = data.url || this.url;
};

User.prototype.setPassword = function (password) {
    if (!password) {
        if (this.hash) {
            return new Q();
        } else {
            throw new Error('Password cannot be blank');
        }
    }

    return bcrypt.generate(password)
    .then(function (hash) {
        this.hash = hash;
    }.bind(this));
};

User.prototype.getPackages = function () {
    return packageDatabase.view('package-owners', 'by-owner', {keys: [this.name]})
    .fail(function (error) {
        console.log('Uh oh!');
        console.log(error);
        throw error;
    })
    .then(function (result) {
        return result.rows.map(function (row) {
            return row.value;
        });
    });
};

Object.seal(User.prototype);

User.load = function (name) {
    return database.get(name)
    .then(function (data) {
        if (!data) {
            return Q.reject(new Error('User not found'));
        }

        var user = new User(data);

        return user.getPackages()
        .then(function (packages) {
            user.packages = packages;
            return user;
        });
    });
};

module.exports = User;
