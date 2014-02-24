'use strict';

var pg = require('pg');
var serverStatus = require('./status');

var connectionString = process.env.DATABASE_URL;

pg.defaults.ssl = true;

module.exports = {};

module.exports.query = function (query, parameters, callback) {
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
