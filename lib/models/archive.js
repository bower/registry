var _ = require('lodash');
var Validotron = require('validotron');
var Q = require('q');
var util = require('util');

var registry = require('../registry');
var Model = require('../models/model');

var defaults = {
    resource: 'archives'
};

function Archive(data) {
    Model.call(this, data, defaults);
    this.resource = 'archives';
    this.model._id = this.model._id || data.name;
}

util.inherits(Archive, Model);

Archive.search = Model.search.bind(Archive, 'Archives');
Archive.destroy = Model.destroy;

// Model Validation
Archive.prototype.validate = function () {
    var validation = new Validotron();

    return validation.errors;
};

Archive.prototype.find = function (name) {
    return registry.get(name)
    .then(function (data) {
        return data;
    });
};

Archive.prototype.save = function () {
    var model = this.model;

    var errors = this.validate();

    if (errors && !_.isEmpty(errors)) {
        return Q.reject(errors);
    }

    this.set('ctime', new Date().toISOString());

    return registry.attachment.insert(
        model.archive.name,
        model.archive.path,
        null,
        'application/zip'
    ).then(function () {
        return registry.get(model._id);
    });
};


module.exports = Archive;
