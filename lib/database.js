'use strict';

var Promise = require('bluebird');
var pg = require('pg');
var serverStatus = require('./status');
var config = require('config');

var parseDatabaseUrl = require('parse-database-url');

var connectionString = exports.connectionString = config.get('database.url');

var connectionParams = exports.connectionParams = parseDatabaseUrl(connectionString);

pg.defaults.ssl = config.get('database.ssl');
pg.defaults.poolSize = config.get('database.poolSize');

var memcached = require('./memcached');

var adminQuery = Promise.promisify(function (query, done) {
    var client = new pg.Client({
        user: connectionParams.user,
        password: connectionParams.password,
        database: 'postgres',
        dialect: 'postgres'
    });

    client.connect(function(err) {
        if (err) return done(err);

        return client.query(query, function(err, result) {
            if (err) {
                done(err);
            }
            client.end();
            done(null, result);
        });
    });
});

var executeKnex = function (builder) {
    var knex = require('knex')({
        client: 'pg',
        connection: config.get('database.url'),
        pool: { max: 0 }
    });

    return builder(knex).then(
        function (result) { knex.destroy(); return result; },
        function (reason) { knex.destroy(); throw reason; }
    );
};

var query = function (query, parameters, callback) {
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

var removeCacheAndReturn = function (name, callback) {
    return function () {
        var args = arguments;
        memcached.delete(name, function () {
           callback.apply(null, args);
        });
    };
};

exports.insertPackage = function (name, url, callback) {
    query('INSERT INTO packages (name, url) VALUES ($1, $2)', [name, url], removeCacheAndReturn('packages', callback));
};

exports.deletePackage = function (name, callback) {
    query('DELETE FROM packages WHERE name = $1', [name], removeCacheAndReturn('packages', callback));
};

exports.hit = function (name) {
    // query('UPDATE packages SET hits = hits + 1 WHERE name = $1', [name]);
};

exports.searchPackages = function (term, callback) {
    query('SELECT name, url FROM packages WHERE name ILIKE $1 OR url ILIKE $1 ORDER BY hits DESC', ['%' + term + '%'], callback);
};

exports.truncate = function (callback) {
    // Safeguard :)
    if (process.env.NODE_ENV == 'test') {
        query('TRUNCATE packages RESTART IDENTITY', removeCacheAndReturn('packages', callback));
    } else {
        removeCacheAndReturn('packages', callback)();
    }
};

// @return {Promise}
exports.migrate = function () {
    return executeKnex(function (knex) {
        return knex.migrate.latest();
    });
};

// @return {Promise}
exports.rollback = function () {
    return executeKnex(function (knex) {
        return knex.migrate.rollback();
    });
};

// @return {Promise}
exports.createDatabase = function () {
    if (!connectionParams.database) {
        throw 'Correct database name is required (check DATABASE_URL)';
    }

    return adminQuery('CREATE DATABASE ' + connectionParams.database).then(
        null,
        function (error) { console.error(error.messagePrimary); }
    );
};

// @return {Promise}
exports.dropDatabase = function () {
    // Just to be safe :)
    if (process.env.NODE_ENV == 'production') return;

    if (!connectionParams.database) {
        throw 'Correct database name is required (check DATABASE_URL)';
    }

    return adminQuery('DROP DATABASE ' + connectionParams.database).then(
        null,
        function (error) { console.error(error.messagePrimary); }
    );
};
