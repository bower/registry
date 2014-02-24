'use strict';

var serverStatus = require('../status');
var database = require('../database');

module.exports = {};

module.exports.list = function (request, response) {
	serverStatus.allPackages++;
	database.query('SELECT name, url FROM packages ORDER BY name', function (error, result) {
		if (error) {
			serverStatus.errors.allPackagesQuery++;
			return response.send(500, 'Database error');
		}
		response.send(result.rows);
	});
};

module.exports.create = function (request, response) {
	serverStatus.createPackage++;
	if (/^git:\/\//.test(request.body.url)) {
		database.query('INSERT INTO packages (name, url) VALUES ($1, $2)', [request.body.name, request.body.url], function (error) {
			if (error) {
				serverStatus.errors.createPackageQuery++;
				return response.send(406);
			}
			response.send(201);
		});
	} else {
		serverStatus.errors.badUrl++;
		response.send(400);
	}
};

module.exports.fetch = function (request, response) {
	serverStatus.getPackage++;
	database.query('SELECT name, url FROM packages WHERE name = $1', [request.params.name], function (error, result) {
		if (error) {
			serverStatus.errors.getPackageQuery++;
			return response.send(500, 'Database error');
		}
		if (result.rows.length === 0) {
			serverStatus.errors.notFound++;
			return response.send(404);
		}
		response.send(result.rows[0]);

		database.query('UPDATE packages SET hits = hits + 1 WHERE name = $1', [request.params.name]);
	});
};

module.exports.search = function (request, response) {
	serverStatus.searchPackage++;
	database.query('SELECT name, url FROM packages WHERE name ILIKE $1 ORDER BY hits DESC', ['%' + request.params.name + '%'], function (error, result) {
		if (error) {
			serverStatus.errors.searchPackageQuery++;
			return response.send(500, 'Database error');
		}
		response.send(result.rows);
	});
};
