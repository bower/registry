var _ = require('lodash');

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

module.exports = Model;
