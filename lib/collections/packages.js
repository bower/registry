var Package = require('../models/package');
var Q = require('q');


var Packages = function(registry) {
  this.registry = registry;
  this.length = 0;
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

function queryResult(query, collection) {
  return query.then(function(data) {
    collection.reset(data.rows);
    return Q.resolve(collection);
  };
}

Package.prototype.all: function(orderDescending) {
  var collection = this; 
  var query = collection.registry.view('packages', 'byDate', {descending: orderDescending});

  return queryResult(query, collection);
};

Packages.prototype.search = function(name) {
  var query = this.registry.search('packages', 'packages', { q: name });

  return queryResult(query, collection);
};
