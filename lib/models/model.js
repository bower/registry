// The constructor should only pass in CouchDB documents, not client data
var Model = function (fields, data) {
    var value;

    this.fields = fields;

    data = data || {};

    for (var field in fields) {
        if (fields[field].couch) {
            value = data[field];
        } else {
            value = undefined;
        }
        this[field] = value || fields[field]['default']; // default is a reserved word
    }

    if (data.documentType && data.documentType !== this.documentType) {
        throw new Error('Mismatch - tried to load a "' + data.documentType + '" as a "' + this.documentType + '"');
    }

    this._id = data._id;
    this._rev = data._rev;
    this.created = data.created || new Date().toISOString();
    this.modified = data.modified || new Date().toISOString();
};

Model.prototype.toCouch = function () {
    // This prevents us from storing garbage in couch

    if (!this.name) {
        throw new Error('A ' + this.documentType + ' must have a name');
    }

    this.modified = new Date().toISOString();

    var result = {
        _id: this._id,
        _rev: this._rev,
        documentType: this.documentType,
        created: this.created,
        modified: this.modified
    };

    for (var field in this.fields) {
        if (this.fields[field].couch) {
            result[field] = this[field];
        }
    }

    return result;
};

Model.prototype.toClient = function () {
    // This prevents us leaking implementation details to the outside world

    var result = {};

    for (var field in this.fields) {
        if (this.fields[field].client) {
            result[field] = this[field];
        }
    }

    return result;
};

Model.prototype.getId = function () {
    return this._id || this.documentType + '|' + this.name;
};

Model.prototype.save = function () {
    return this.database.insert(this.toCouch(), this.getId());
};

Model.prototype.destroy = function () {
    return this.database.destroy(this.getId(), this._rev);
};

module.exports = Model;
