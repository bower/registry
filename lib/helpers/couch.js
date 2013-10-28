var Q = require('q');

// All nano callbacks get two parameters which makes Q decide to wrap them in an array
// The actual result is the first arg, so we just resolve to that instead.
var binder = function (method) {
    return function () {
        var bound = Q.nbind(this._db[method], this._db);
        return bound.apply(this._db, [].slice.call(arguments))
        .then(function (data) {
            return data[0];
        });
    };
};

var attachmentBinder = function (method) {
    return function () {
        var bound = Q.nbind(this._db.attachment[method], this._db.attachment);
        return bound.apply(this._db.attachment, [].slice.call(arguments))
        .then(function (data) {
            return data[0];
        });
    };
};

var CouchWrapper = function (server, name) {
    this._db = server.use(name);
};

CouchWrapper.prototype = {
    insert: binder('insert'),
    destroy:  binder('destroy'),
    get:  binder('get'),
    head:  binder('head'),
    copy:  binder('copy'),
    bulk:  binder('bulk'),
    list:  binder('list'),
    fetch:  binder('fetch'),
    view:  binder('view'),
    show:  binder('show'),
    atomic:  binder('atomic'),

    attachmentInsert: attachmentBinder('insert'),
    attachmentGet: attachmentBinder('get'),
    attachmentDestroy: attachmentBinder('destroy'),

    attachmentGetStream: function (docname, attachmentName, params) {
        return this._db.attachment.get(docname, attachmentName, params);
    }
};

module.exports = CouchWrapper;
