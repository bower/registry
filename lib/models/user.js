var _ = require('lodash');
var Validotron = require('validotron');
var Q = require('q');
var bcrypt = require('../helpers/bcrypt');

var registry = require('../registry');


// User Object
var userDefaults = {
    name: null,
    password: null,
    email: null,
    url: null
};

var documentDefaults = {
    resource: 'users',
    _id: null
};

function User(data) {
    this._model = _.extend({}, userDefaults, documentDefaults, data);
    this._model._id = this._model._id || data.name;
    this._model.name = this._model.name || data.name;
    this._model.password = this._model.password || data.password;
    this._model.email = this._model.email || data.email;
    this._model.url = this._model.url || data.url;
}

User.prototype.get = function (key) {
    return this._model[key];
};

User.prototype.set = function (key, value) {
    this._model[key] = value;
    this._model.mtime = new Date().toISOString();
    return this;
};

User.prototype.toObject = function () {
    var model = this;
    var pkg = {};
    Object.keys(userDefaults).forEach(function (key) {
        pkg[key] = model.get(key);
    });
    return pkg;
};

// returns JSON representation of model
User.prototype.toJSON = function () {
    return JSON.stringify(this.toObject());
};

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
        },
        email: {
            data: this.get('email'),
            presence: true
        },
        url: {
            data: this.get('url'),
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
    var _model = this._model;

    var errors = this.validate();

    if (errors && !_.isEmpty(errors)) {
        dfd.reject(errors);
    }

    bcrypt.generate(_model.password).then(function (hash) {

        _model.password = hash;
        _model.ctime = new Date().toISOString();

        registry.insert(_model, _model._id).then(function () {
            dfd.resolve(registry.get(_model._id));
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
