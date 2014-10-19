var Q = require('q');
var util = require('util');
var Model = require('./model');
var database = require('../helpers/database');

var fields = {
    name: {couch: true, client: true},
    description: {couch: true, client: true},
    keywords: {couch: true, client: true, 'default': []},
    owners: {couch: true, client: true, 'default': []},
    type: {couch: true, client: true},
    url: {couch: true, client: true},
    versions: {couch: true, client: true, 'default': []},
    attachments: {couch: true}
};

var Package = function (data) {
    Model.call(this, fields, data);

    if (this.attachments) {
        this.versions = [];

        for (var version in data.attachments) {
            this.versions.push(version);
        }
    }

    Object.seal(this);
};

util.inherits(Package, Model);

Package.prototype.documentType = 'package';
Package.prototype.database = database;

Package.prototype.update = function (data) {
    if (data.name && this.name && data.name !== this.name) {
        throw new Error('Cannot rename a package');
    }

    if (data.type) {
        switch (data.type) {
        case 'git':
        case 'file':
        case 'archive':
            break;
        default:
            throw new Error('Package type must be one of "git", "file" or "archive"');
        }

        if (data.type === 'archive' && !data.url) {
            data.url = '/archives/' + data.name;
        }
    }

    if (!/^(https?|ssh?|git):\/\//.test(data.url)) {
        if (data.url !== '/archives/' + data.name) {
            throw new Error('Unsupported URL type "' + data.url + '"');
        }
    }

    this.name = this.name || data.name;

    this.description = data.description || this.description || '';
    this.keywords = data.keywords || this.description || [];
    this.type = data.type || this.type;
    this.url = data.url || this.url;
};

Package.prototype.addOwner = function (name) {
    if (this.owners.indexOf(name) === -1) {
        this.owners.push(name);
    }
};

Package.prototype.ownedBy = function (name) {
    return this.owners.indexOf(name) !== -1;
};

Package.prototype.addArchive = function (archive, version) {
    // archive is the express request object wrapped in a Readable stream

    // It seems that nano doesn't let us stream the attachment out. We
    // have to fully buffer it first.
    // TODO(wibblymat): Patch nano to accept streams.
    var deferred = Q.defer();
    var buffers = [];

    archive.on('data', function (data) {
        buffers.push(data);
    });

    archive.on('end', function () {
        deferred.resolve(database.attachmentInsert(
            this._id,
            version,
            Buffer.concat(buffers),
            archive.headers['content-type'],
            {
                rev: this._rev
            }
        ));
    }.bind(this));

    return deferred.promise;
};

Package.load = function (name) {
    return database.get('package|' + name)
    .then(function (data) {
        if (!data) {
            throw new Error('Package not found');
        }

        return new Package(data);
    });
};

Object.seal(Package.prototype);

module.exports = Package;
