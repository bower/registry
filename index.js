'use strict';

var express = require('express');
var pg = require('pg');

pg.defaults.ssl = true;

var app = express();
var connectionString = process.env.SHARED_DATABASE_URL;
var serverStatus = {
	errors: {
		dbConnect: 0,
		allPackagesQuery: 0,
		createPackageQuery: 0,
		badUrl: 0,
		getPackageQuery: 0,
		notFound: 0,
		searchPackageQuery: 0
	},
	getPackage: 0,
	searchPackage: 0,
	createPackage: 0,
	allPackages: 0,
	started: +(new Date())
};

app.configure(function () {
	app.use(express.logger());
	app.use(express.compress());
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

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

app.get('/status', function (request, response) {
	response.send(serverStatus);
});

app.get('/packages', function (request, response) {
	serverStatus.allPackages++;
	query('SELECT name, url FROM packages ORDER BY name', function (error, result) {
		if (error) {
			serverStatus.errors.allPackagesQuery++;
			return response.send(500, 'Database error');
		}
		response.send(result.rows);
	});
});

app.post('/packages', function (request, response) {
	serverStatus.createPackage++;
	if (/^git:\/\//.test(request.body.url)) {
		query('INSERT INTO packages (name, url) VALUES ($1, $2)', [request.body.name, request.body.url], function (error) {
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
});

app.get('/packages/:name', function (request, response) {
	serverStatus.getPackage++;
	query('SELECT name, url FROM packages WHERE name = $1', [request.params.name], function (error, result) {
		if (error) {
			serverStatus.errors.getPackageQuery++;
			return response.send(500, 'Database error');
		}
		if (result.rows.length === 0) {
			serverStatus.errors.notFound++;
			return response.send(404);
		}
		response.send(result.rows[0]);

		query('UPDATE packages SET hits = hits + 1 WHERE name = $1', [request.params.name]);
	});
});

app.get('/packages/search/:name', function (request, response) {
	serverStatus.searchPackage++;
	query('SELECT name, url FROM packages WHERE name ILIKE $1 ORDER BY hits DESC', ['%' + request.params.name + '%'], function (error, result) {
		if (error) {
			serverStatus.errors.searchPackageQuery++;
			return response.send(500, 'Database error');
		}
		response.send(result.rows);
	});
});

app.listen(process.env.PORT);
