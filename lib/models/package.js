var _ = require('lodash');
var Validotron = require('validotron');
var Q = require('q');

var registry = require('../registry');

// Package Object
var packageDefaults = {
    name: null,
    description: null,
    type: null,
    owners: [],
    versions: [],
    keywords: [],
    url: null
};

var documentDefaults = {
    resource: 'packages',
    _id: null
};

function Package(data) {
    this._model = _.extend({}, packageDefaults, documentDefaults, data);
    this._model._id = this._model._id || data.name;
}

Package.prototype.get = function (key) {
    return this._model[key];
};

Package.prototype.set = function (key, value) {
    this._model.mtime = new Date().toISOString();
    this._model[key] = value;
    return this;
};

Package.prototype.toObject = function () {
    var model = this;
    var pkg = {};
    Object.keys(packageDefaults).forEach(function (key) {
        pkg[key] = model.get(key);
    });
    return pkg;
};

Package.prototype.toJSON = function () {
    return JSON.stringify(this.toObject());
};

// Model Validation
Package.prototype.validate = function () {
    this.errors = undefined;

    var validation = new Validotron({
        name: {
            data: this.get('name'),
            presence: true
        },
        owners: {
            data: this.get('owners'),
            presence: true
        },
        url: {
            data: this.get('url'),
            presence: true,
            format: {
                'with': '^(git|https):\/\/'
            }
        },
        type: {
            data: this.get('type'),
            presence: true,
            inclusion: {
                'in': ['git', 'file', 'archive']
            }
        }
    });

    this.errors = validation.errors;
};

Package.search = function (name, callback) {
    registry.search('packages', 'packages', {
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

Package.prototype.save = function () {
    var _model = this._model;

    this.validate();

    if (this.errors && !_.isEmpty(this.errors)) {
        return Q.reject(this.errors);
    }

    _model.ctime = new Date().toISOString();

    return registry.insert(_model, _model._id).then(function () {
        return registry.get(_model._id);
    });
};

Package.prototype.destroy = function (id) {
    if (id) {
        return registry.get(id).then(function (data) {
            return registry.destroy(data._id, data._rev);
        });
    }
};

module.exports = Package;
