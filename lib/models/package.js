var _ = require('lodash');
var Validotron = require('validotron');
var Q = require('q');
var util = require('util');

var registry = require('../registry');
var Model = require('../models/model');

var defaults = {
    name: null,
    description: null,
    type: null,
    owners: [],
    versions: [],
    keywords: [],
    url: null
};

function Package(data) {
    Model.call(this, data, defaults);
    this.resource = 'packages';
    this.model._id = this.model._id || data.name;
}

util.inherits(Package, Model);

// Model Validation
Package.prototype.validate = function () {
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

    return validation.errors;
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
    var model = this.model;

    var errors = this.validate();

    if (errors && !_.isEmpty(errors)) {
        return Q.reject(errors);
    }

    model.ctime = new Date().toISOString();

    return registry.insert(model, model._id).then(function () {
        return registry.get(model._id);
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
