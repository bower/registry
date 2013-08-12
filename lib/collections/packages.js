//
// collections/packages
//

var Package = require('../models/package');
var Q = require('q');


//
//  A super-duper array of models
//
var Packages = function (registry, models) {
    this.registry = registry;
    this.length = 0;

    this.reset(models);
  };


//
// description
// @param {type} param
//
Packages.prototype = [];


//
// description
// @param {type} param
//
Packages.prototype.constructor = Packages;


//
// description
// @param {type} param
//
Packages.prototype.reset = function (models) {

  models = models || [];

  this.splice(0, this.length);

  for (var i = 0; i < models.length; i++) {
    if (models[i] instanceof Package) {
      this[i] = models[i];
    } else {
      this[i] = new Package(this.registry, models[i]);
    }
  }

  this.length = models.length;
};


//
// description
// @param {type} param
//
Packages.prototype.resetQuery = function (query) {
  var collection = this;

  return query.then(function (data) {
    collection.reset(data.rows.map(function (document) {
      return document.doc || document.value;
    }));
    return Q.resolve(collection);
  });
};


//
// description
// @param {type} param
//
Packages.prototype.toArray = function () {
  return this.map(function (model) {
    return model.toObject();
  });
};


//
// return all packages
// @param {boolean} orderDescending
//
Packages.prototype.all = function (orderDescending) {
  var query = this.registry.view('packages', 'byDate', {
    descending: !! orderDescending
  });

  return this.resetQuery(query);
};


//
// search for specific package.
// @param {string} packageName The name of a package.
//
Packages.prototype.search = function (name) {
  var query = this.registry.search('packages', 'packages', {
    q: name
  });

  return this.resetQuery(query);
};


//
// fetch packages.
// @param {integer} packageId The id a package.
// @param {object}
//
Packages.prototype.fetch = function (ids, params) {
  if (typeof ids === 'string') {
    ids = [ids];
  }

  var args = [{
    keys: ids
  }];

  if (params) {
    args.push(params);
  }

  var query = this.registry.fetch.apply(this.registry, args);
  return this.resetQuery(query);
};

module.exports = Packages;
