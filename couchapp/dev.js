var couchapp = require('couchapp'),
    docs = require('./ddocs');

docs.forEach(function(doc) {

  'use strict';

  couchapp.createApp(doc, 'http://localhost:5984/bower-registry', function(app) {
    app.push();
  });
});

