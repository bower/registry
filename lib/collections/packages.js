'use strict';

var Package = require('../models/package');
var Q = require('q');

// A super-duper array of models
var Packages = function(registry, models) {
  this.registry = registry;
  this.length = 0;

  this.reset(models);
};

Packages.prototype = [];
Packages.prototype.constructor = Packages;

Packages.prototype.reset = function(models) {
  
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

Packages.prototype.resetQuery = function(query) {
  var collection = this;
  return query.then(function(data) {
    collection.reset(data.rows);
    return Q.resolve(collection);
  });
};

Packages.prototype.all = function(orderDescending) {
  var query = this.registry.view('packages', 'byDate', {descending: !!orderDescending});
  return this.resetQuery(query);
};

Packages.prototype.search = function(name) {
  var query = this.registry.search('packages', 'packages', { q: name });
  return queryResult(query, this);
};

module.exports = Packages;
