/* global emit:true */

var docs = [{
    _id: '_design/packages',
    views: {
        all: {
            map: function (doc) {
                if (doc.resource === 'packages') {
                    emit(doc._id, doc);
                }
            }
        },
        byDate: {
            map: function (doc) {
                if (doc.resource === 'packages') {
                    emit(doc.ctime, doc);
                }
            }
        },
        by_name: {
            map: function (doc) {
                if (doc.resource === 'packages') {
                    emit(doc._id, doc);
                }
            }
        }
    }
},
{
    _id: '_design/users',
    views: {
        all: {
            map: function (doc) {
                if (doc.resource === 'users') {
                    emit(doc._id, doc);
                }
            }
        },
        by_name: {
            map: function (doc) {
                if (doc.resource === 'users') {
                    emit(doc._id, doc);
                }
            }
        }
    }
},
{
    _id: '_design/archives',
    views: {
        all: {
            map: function (doc) {
                if (doc.resource === 'archives') {
                    emit(doc._id, doc);
                }
            }
        },
        by_name: {
            map: function (doc) {
                if (doc.resource === 'archives') {
                    emit(doc._id, doc);
                }
            }
        }
    }
}];

module.exports = docs;
