var couchapp = require('couchapp');
var docs = require('./ddocs');
var path = require('path');
var nano = require('nano');


module.exports = function(options) {
  this.modules = {};
  this.db = nano(options.protocol + '://' +
                  options.username +
                  ':' + options.password +
                  '@' + options.host +
                  ':' + options.port);
  if (options.temporary) {
    // make async
    nano.db.destroy(options.database);
    nano.db.create(options.database);
  }




};

module.exports.prototype = {
  addModule: function(name, module) {
    this.modules[name] = module;
  }
};
  

