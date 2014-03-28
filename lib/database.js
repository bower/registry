'use strict';

var pg = require('pg');
var serverStatus = require('./status');
var config = require('./config');

var connectionString = config.databaseUrl;

pg.defaults.ssl = true;

var query = exports.query = function (query, parameters, callback) {
    if (typeof parameters === 'function') {
        callback = parameters;
        parameters = [];
    }
    if (typeof callback !== 'function') {
        callback = function () {};
    }

    pg.connect(connectionString, function (error, client, done) {
        if (error) {
            serverStatus.errors.dbConnect++;
            return callback(error);
        }

        client.query(query, parameters, function (error, result) {
            done(); // Release the database handle
            callback(error, result);
        });
    });
};

// TODO: Prepared statements? Or straight to Couch?
exports.getPackage = function (name, callback) {
    query('SELECT name, url, hits FROM packages WHERE name = $1', [name], callback);
};

exports.getPackages = function (callback) {
    query('SELECT name, url, hits FROM packages ORDER BY name', callback);
};

exports.insertPackage = function (name, url, callback) {
    query('INSERT INTO packages (name, url) VALUES ($1, $2)', [name, url], callback);
};

exports.deletePackage = function (name, callback) {
    query('DELETE FROM packages WHERE name = $1', [name], callback);
};

exports.hit = function (name) {
    query('UPDATE packages SET hits = hits + 1 WHERE name = $1', [name]);
};

exports.searchPackages = function (term, callback) {
    query('SELECT name, url FROM packages WHERE name ILIKE $1 ORDER BY hits DESC', ['%' + term + '%'], callback);
};
