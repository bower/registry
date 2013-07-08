'use strict';

var couchapp = require('couchapp');
var docs = require('./../couchapp/ddocs');
var path = require('path');
var nano = require('nano');
var Model = require('./models/package');
var Q = require('q');



function Registry(options) {
  this.modules = {};
  var dfd = Q.defer();
  this.promise = dfd.promise;
  this.options = options;

  var couch = this.couch = nano(this.url());

  this.couch = couch;
  function createApp() {
    couch.db.create(options.database, function() {
      docs.forEach(function(doc, i) {
        couchapp.createApp(doc, 'http://localhost:5984/bower-registry-testing', function(app) {
          app.push();
          if ((i+1) >= docs.length) {
            dfd.resolve(couch.use(options.database));
          }
        });
      });
    });
  }

  if (options.temporary) {
    couch.db.destroy(options.database, function() {
      createApp();
    });
  } else {
    createApp();
  }
}

Registry.prototype = {
  url: function(opts) {
    var options = opts || this.options;

    var protocol = options.protocol + '://';
    var credentials = options.username || '';
    var host = options.host;
    if (options.password) {
      credentials += ':' + options.password;
    }
    if (credentials) {
      credentials += '@';
    }
    if (options.port) {
      host += ':' + options.port;
    }

    return protocol + credentials + host;
  },

  teardown: function() {
    var registry = this;
    
    return this.promise.then(function() {
      var dfd = Q.defer();
      registry.couch.db.destroy(registry.options.database, function() {
        dfd.resolve();
      });
      return dfd.promise;
    });
  }
};

// make db methods
(function() {
  
  var getDbFunction = function(db, key) {
    var deep = key.split('.');
    var fn = db;
    for (var i = 0; i < deep.length; i++) {
      fn = fn[deep[i]];
    }
    return fn;
  };
  
  var makeDbFunction = function(proto, key, fn) {
    var root = proto;
    var deep = key.split('.');
    var level = deep.length;

    deep.forEach(function(prop) {
      level--;
      // end of the road? assign the fn
      if (level < 1) {
        root[prop] = fn;
        return;
      }
      // make sure it's an object
      root[prop] = root[prop] || {};
      // update the root
      root = root[prop];
    });
    
  };
  
  'insert get head copy bulk list fetch view show atomic attachment.insert attachment.get attachment.destroy'
  .split(' ').forEach(function(functionName) {
    makeDbFunction(Registry.prototype, functionName, function() {
      var fn = getDbFunction(this.db, functionName);
      var dfd = Q.defer();
      var args = [].slice.call(arguments);
      var callback = args[args.length-1];

      args[args.length] = function(err) {
        // if old-school callback was supplied…
        if (typeof callback === 'function') {
          callback.apply(this, arguments);
        }
        if (err) {
          dfd.reject.apply(dfd.reject, arguments);
          return;
        }
        dfd.resolve.apply(dfd.resolve, [].slice.call(arguments,1));
        return;
      };
    });
  });
}());

module.exports = Registry;
