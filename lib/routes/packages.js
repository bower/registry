'use strict';

var serverStatus = require('../status');
var database = require('../database');


exports.list = function (request, response) {
    serverStatus.allPackages++;
    database.getPackages(function (error, result) {
        if (error) {
            serverStatus.errors.allPackagesQuery++;
            return response.send(500, 'Database error');
        }
        response.send(result.rows);
    });
};

exports.create = function (request, response) {
    serverStatus.createPackage++;
    if (/^git:\/\//.test(request.body.url)) {
        database.insertPackage(request.body.name, request.body.url, function (error) {
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

exports.fetch = function (request, response) {
    serverStatus.getPackage++;
    database.getPackage(request.params.name, function (error, result) {
        if (error) {
            serverStatus.errors.getPackageQuery++;
            return response.send(500, 'Database error');
        }
        if (result.rows.length === 0) {
            serverStatus.errors.notFound++;
            return response.send(404);
        }
        response.send(result.rows[0]);

        database.hit(request.params.name);
    });
};

exports.search = function (request, response) {
    serverStatus.searchPackage++;
    database.searchPackages(request.params.name, function (error, result) {
        if (error) {
            serverStatus.errors.searchPackageQuery++;
            return response.send(500, 'Database error');
        }
        response.send(result.rows);
    });
};
