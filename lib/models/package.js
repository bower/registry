//
// models.package
//

var db = require('../db/couch'),
    _ = require('lodash'),
    Validotron = require('validotron');


//
// Model Object
//
var Model = function (data) {

  'use strict';

  data = data || {};

  this._model = {
    resource: 'packages',
    name: _.has(data, 'name') ? data.name: undefined,
    version: _.has(data, 'version') ? data.version: undefined
  };

};

//
// Model factory
//
// creates a new instance of the model with whatever
// data is being passed in.
//

Model.factory = function (data) {

  'use strict';

  return new Model(data);
};


//
// Model validation
//

Model.prototype.validate = function() {

  'use strict';

  this.errors = undefined;

  var validation = new Validotron({
    name: {
      data: this._model.name,
      presence: true
    },
    version: {
      data: this._model.version,
      presence: true
    }
  });

  this.errors = validation.errors;

};


//
// list Method
//
Model.list = function(callback) {

  'use strict';

  db.view('packages', 'byDate', {descending: true}, function (err, data) {
    var payload = [];

    if (err) { return callback(err); }

    data.rows.forEach(function(doc) {
      payload.push(doc.value);
    });

    return callback(null, payload);

  });

};

//
// find Method
//
Model.find = function(id, callback) {

  'use strict';

  if (id) {
    db.get(id, function (err, data) {
      if (err) { return callback(err); }

      return callback(null, data);
    });
  }

};

//
// save Method
//
Model.prototype.save = function(callback) {

  'use strict';

  var _model = this._model;

  this.validate();

  if (this.errors && !_.isEmpty(this.errors)) {
    return callback(this.errors, false);
  }

  _model.ctime = new Date().toISOString();

  db.insert(_model, function(err, res) {
    if (err) { return callback(err); }

    db.get(res.id, function (err, data) {
      if (err) { return callback(err); }

      return callback(null, data);
    });

  });

};


//
// update Method
//
Model.prototype.update = function (id, callback) {

  'use strict';

  var _model = this._model;

  this.validate();

  if (this.errors && !_.isEmpty(this.errors)) {
    return callback(this.errors, false);
  }

  db.get(id, function (err, doc) {
    if (err) { return callback(err); }

    // assign the current docs rev to the
    // revision of the doc we are going to
    // insert
    _model._rev = doc._rev;
    _model.ctime = doc.ctime;
    _model.mtime = new Date().toISOString();

    db.insert(_model, id, function(err, res) {
      if (err) { return callback(err); }

      return callback(null, res);
    });

  });

};


//
// remove Method
//
Model.remove = function(id, callback) {

  'use strict';

  if (id) {

    db.get(id, function(err, data) {
      if (err) {
        return callback(err);
      }

      db.destroy(data._id, data._rev, function(err, res) {
        if (err) {
          return callback(err);
        }

        return callback(null, res);
      });
    });

  }

};

module.exports = Model;
