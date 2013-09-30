var _ = require('lodash');
var Validotron = require('validotron');
var Q = require('q');
var bcrypt = require('../helpers/bcrypt');
var util = require('util');

var registry = require('../registry');
var Model = require('../models/model');

var defaults = {
    name: null,
    password: null,
    email: null,
    url: null
};

function User(data) {
    Model.call(this, data, defaults);
    this.resource = 'users';
    this.model._id = this.model._id || data.name;
}

util.inherits(User, Model);

// Model Validation
User.prototype.validate = function () {
    var validation = new Validotron({
        name: {
            data: this.get('name'),
            presence: true,
            length: {
                miniumum: 3
            }
        },
        password: {
            data: this.get('password'),
            presence: true
        }
    });

    return validation.errors;
};

User.prototype.search = function (name, callback) {
    registry.search('users', 'users', {
        q: name
    }, function (err, doc) {
        var payload = [];
        if (err) {
            return callback(err, null);
        }

        if (doc.rows.length === 0) {
            return callback(null, payload);
        } else {
            doc.rows.forEach(function (doc) {
                payload.push(doc.fields);
            });

            return callback(null, payload);
        }
    });

};

User.prototype.find = function (name) {
    var dfd = Q.defer();

    registry.get(name, function (err, data) {
        if (err) {
            dfd.reject(err);
        }

        dfd.resolve(_.pick(data, 'email', 'name', 'url'));
    });

    return dfd.promise;
};

User.prototype.save = function () {
    var dfd = Q.defer();
    var model = this.model;

    var errors = this.validate();

    if (errors && !_.isEmpty(errors)) {
        dfd.reject(errors);
    }

    bcrypt.generate(model.password).then(function (hash) {
        model.password = hash;
        model.ctime = new Date().toISOString();

        registry.insert(model, model._id).then(function () {
            dfd.resolve(registry.get(model._id));
        });

    }, function (err) {
        dfd.reject(err);
    });

    return dfd.promise;
};

User.prototype.destroy = function (id) {
    if (id) {
        return registry.get(id).then(function (data) {
            return registry.destroy(data._id, data._rev);
        });
    }
};

module.exports = User;
