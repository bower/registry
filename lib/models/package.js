//
// models/package
//

var _ = require('lodash');
var Validotron = require('validotron');
var Q = require('q');


//
// Model Object
//
var packageDefaults = {
  name: null,
  version: null,
  main: null,
  url: null,
  ignore: null,
  dependencies: null,
  devDependencies: null
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


//
//
//
Model.prototype.get = function (key) {
  return this._model[key];
};


//
//
//
Model.prototype.set = function (key, value) {
  this._model.mtime = new Date().toISOString();
  this._model[key] = value;
  return this;
};


//
//
//
Model.prototype.toObject = function () {
  var model = this;
  var pkg = {};
  Object.keys(packageDefaults).forEach(function (key) {
    pkg[key] = model.get(key);
  });
  return pkg;
};

//
//
//
Model.prototype.toJSON = function () {
  return JSON.stringify(this.toObject());
};

//
// Model Validation
//
Model.prototype.validate = function () {

  this.errors = undefined;

  var validation = new Validotron({
    name: {
      data: this.get('name'),
      presence: true
    },
    url: {
      data: this.get('url'),
      format: {
        'with': '^(git|https):\/\/'
      }
    }
  });

  this.errors = validation.errors;
};


//
// search Method
//
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


//
// find Method
//
Model.find = function (id, callback) {

  if (id) {
    this.registry.get(id, function (err, data) {
      if (err) {
        return callback(err);
      }

      return callback(null, _.pick(data, 'name', 'url'));
    });
  }

};


//
// save Method
//
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

module.exports = Model;
