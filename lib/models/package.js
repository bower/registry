var _ = require('lodash');
var Validotron = require('validotron');
var Q = require('q');

// Model Object
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

function Model(registry, data) {
    this.registry = registry;
    this._model = _.extend({}, packageDefaults, documentDefaults, data);
    this._model._id = this._model._id || data.name;
}

Model.prototype.get = function (key) {
    return this._model[key];
};

Model.prototype.set = function (key, value) {
    this._model.mtime = new Date().toISOString();
    this._model[key] = value;
    return this;
};

Model.prototype.toObject = function () {
    var model = this;
    var pkg = {};
    Object.keys(packageDefaults).forEach(function (key) {
        pkg[key] = model.get(key);
    });
    return pkg;
};

Model.prototype.toJSON = function () {
    return JSON.stringify(this.toObject());
};

// Model Validation
Model.prototype.validate = function () {
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

Model.search = function (name, callback) {
    this.registry.search('packages', 'packages', {
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

Model.prototype.save = function () {
    var _model = this._model;

    this.validate();

    if (this.errors && !_.isEmpty(this.errors)) {
        return Q.reject(this.errors);
    }

    _model.ctime = new Date().toISOString();

    return this.registry.insert(_model, _model._id).then(function () {
        return this.registry.get(_model._id);
    }.bind(this));
};

Model.prototype.destroy = function (id) {
    if (id) {
        return this.registry.get(id).then(function (data) {
            return this.registry.destroy(data._id, data._rev);
        }.bind(this));
    }
};

module.exports = Model;
