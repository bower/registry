var couchapp = require('couchapp'),
    path = require('path');

var docs = [
  {
    _id: '_design/packages',
    views: {
      all: {
        map: function (doc) { if (doc.resource === 'packages') { emit(doc._id, doc); } }
      },
      byDate: {
        map: function (doc) { if (doc.resource === 'packages') { emit(doc.date, doc); } }
      },
      by_name: {
        map: function (doc) { if (doc.resource === 'packages') { emit(doc._id, doc); } }
      }
    }
  }
];


docs.forEach(function(doc) {
  couchapp.createApp(doc, 'http://localhost:5984/bower-registry', function(app) {
    app.push();
  });
});

