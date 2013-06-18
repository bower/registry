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

module.exports = docs;
