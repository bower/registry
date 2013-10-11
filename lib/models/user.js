var _ = require('lodash');
var Q = require('q');
var Validotron = require('validotron');
var bcrypt = require('../helpers/bcrypt');
var util = require('util');

var registry = require('../registry');
var Model = require('../models/model');

var defaults = {
    name: null,
    password: null,
    email: null,
    url: null,
    resource: 'users'
};

function User(data) {
    Model.call(this, data, defaults);
    this.resource = 'users';
    this.model._id = this.model._id || data.name;
}

util.inherits(User, Model);

User.search = Model.search.bind(User, 'users');
User.destroy = Model.destroy;

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

User.prototype.find = function (name) {
    return registry.get(name)
    .then(function (data) {
        return _.pick(data, 'email', 'name', 'url');
    });
};

User.prototype.save = function () {
    var model = this.model;

    var errors = this.validate();

    if (errors && !_.isEmpty(errors)) {
        return Q.reject(errors);
    }

    return bcrypt.generate(model.password)
    .then(function (hash) {
        model.password = hash;
        model.ctime = new Date().toISOString();

        return registry.insert(model, model._id)
        .then(function () {
            return registry.get(model._id);
        });

    });
};

module.exports = User;
