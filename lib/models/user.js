//
// models/user
//


var _ = require('lodash');
var Validotron = require('validotron');
var Q = require('q');


//
// Model Object
//
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

function Model(registry, data) {
  this.registry = registry;
  this._model = _.extend({}, userDefaults, documentDefaults, data);
  this._model._id = this._model._id || data.name;
  this._model.name = this._model.name || data.name;
  this._model.password = this._model.password || data.password;
  this._model.email = this._model.email || data.email;
  this._model.url = this._model.url || data.url;
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
  this._model[key] = value;
  this._model.mtime = new Date().toISOString();
  return this;
};


//
//
//
Model.prototype.toObject = function () {
  var model = this;
  var pkg = {};
  Object.keys(userDefaults).forEach(function (key) {
    pkg[key] = model.get(key);
  });
  return pkg;
};

//
// returns JSON representation of model
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

  this.errors = validation.errors;
};


//
// search Method
//
Model.prototype.search = function (name, callback) {

  this.registry.search('users', 'users', { q: name }, function (err, doc) {
    var payload = [];
    if (err) { return callback(err, null); }

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
Model.prototype.find = function () {

  var dfd = Q.defer();

  this.registry.get(this._model._id, function (err, data) {
    if (err) {
      dfd.reject(err);
    }

    dfd.resolve(_.pick(data, 'email', 'name', 'url'));
  });

  return dfd.promise;

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
