var _ = require('lodash');
var registry = require('../registry');

function Model(data, defaults) {
    this.model = _.extend({}, defaults, data);
    this.fields = Object.keys(defaults);
    this.resource = '';
}

Model.prototype.get = function (key) {
    return this.model[key];
};

Model.prototype.set = function (key, value) {
    this.model[key] = value;
    this.model.mtime = new Date().toISOString();
    return this;
};

Model.prototype.toObject = function () {
    var pkg = {};
    this.fields.forEach(function (key) {
        pkg[key] = this.get(key);
    }.bind(this));
    return pkg;
};

// returns JSON representation of model
Model.prototype.toJSON = function () {
    return JSON.stringify(this.toObject());
};

Model.search = function (type, name) {
    registry.search(type, type, {
        q: name
    })
    .then(function (result) {
        var payload = [];

        if (result.rows.length === 0) {
            return payload;
        } else {
            result.rows.forEach(function (doc) {
                payload.push(doc.fields);
            });

            return payload;
        }
    });

};
module.exports = Model;
