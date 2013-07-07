//
// models.package
//
'use strict';

var _ = require('lodash');
var Validotron = require('validotron');


//
// Model Object
//


var defaults = {
  resource: 'packages',
  _id: undefined,
  name: undefined,
  version: undefined,
  main: undefined,
  url: undefined,
  ignore: undefined,
  dependencies: undefined,
  devDependencies: undefined
};

function Model(registry, data) {
  this.registry = registry; 
  this._model = _.extend({}, defaults, data);
}


//
// Model validation
//

Model.prototype.get = function(key) {
  return this._model[key];
};

Model.prototype.set = function(key, value) {
  this._model[key] = value;
  return this;
}

Model.prototype.validate = function() {

  this.errors = undefined;

  var validation = new Validotron({
    name: {
      data: this.get('_id'),
      presence: true
    },
    url: {
      data: this.get('url'),
      format: {
        "with": "^(git|https):\/\/"
      }
    }
  });

  this.errors = validation.errors;
};


//
// list Method
//
Model.list = function(callback) {

  var query = this.registry.view('packages', 'byDate', {descending: true});

  return query.then(function(data) {
    var payload = data.rows.map(function(doc) {
      callback(null, _.pick(doc.value, 'name', 'url'));
    });
  }, function(err) {
    callback(err);
  });

};


//
// search Method
//
Model.search = function(name, callback) {

  this.registry.search('packages', 'packages', { q: name }, function(err, doc) {
    var payload = [];
    if (err) { return callback(err, null); }

    if (doc.rows.length === 0) {
      return callback(null, payload);
    } else {
      doc.rows.forEach(function(doc) {
        payload.push(doc.fields);
      });

      return callback(null, payload);
    }
  });

};


//
// find Method
//
Model.find = function(id, callback) {

  if (id) {
    this.registry.get(id, function (err, data) {
      if (err) { return callback(err); }

      return callback(null, _.pick(data, 'name', 'url'));
    });
  }

};

//
// save Method
//
Model.prototype.save = function(callback) {

  var _model = this._model;

  this.validate();

  if (this.errors && !_.isEmpty(this.errors)) {
    return callback(this.errors, false);
  }

  _model.ctime = new Date().toISOString();

  this.registry.insert(_model, function(err) {
    if (err) { return callback(err); }

    this.registry.get(_model._id, function (err, data) {
      if (err) { return callback(err); }

      return callback(null, data);
    });

  });

};

module.exports = Model;
