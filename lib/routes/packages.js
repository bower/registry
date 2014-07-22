'use strict';

var serverStatus = require('../status');
var database = require('../database');
var config = require('../config');
var isValidName = require('../validName');
var validateURL = require('../validURL');
var url = require('url');
var path = require('path');
var GithubClient = require('github');

function isOwner (packageName, token, callback) {
    if (!token) {
        return callback(null, false);
    }

    var githubClient = new GithubClient({
        version: '3.0.0'
    });
    githubClient.authenticate({
        type: 'oauth',
        token: token
    });

    database.getPackage(packageName, function (error, result) {
        if (error) {
            return callback({ status: 500, message: 'Database error' });
        }
        if (result.rows.length === 0) {
            return callback({ status: 404, message: 'Package not found' });
        }

        var pkg = result.rows[0];
        var urlParts = url.parse(pkg.url);
        var pathParts = urlParts.pathname.split('/');

        if (urlParts.hostname !== 'github.com' || pathParts.length !== 3 || pathParts[0] !== '') {
            return callback({ status: 501, message: 'Can only unregister packages hosted on GitHub.com' });
        }

        var owner = pathParts[1];
        var repo = path.basename(pathParts[2], '.git');

        function ghCheck (next) {
            return function (error) {
                if (error) {
                    if (error.code === 404) {
                        return next();
                    }
                    return callback({ status: 500, message: 'GitHub.com error' });
                }
                callback(null, true);
            };
        }

        githubClient.user.get({}, function (error, user) {
            if (error) {
                return callback({ status: 500, message: 'GitHub.com error' });
            }
            githubClient.repos.getCollaborator({
                user: owner,
                repo: repo,
                collabuser: user.login
            }, ghCheck(function () {
                githubClient.orgs.getTeamMember({
                    id: config.registryEditorsID,
                    user: user.login
                }, ghCheck(function () {
                    callback(null, false);
                }));
            }));
        });
    });
}

exports.remove = function (request, response) {
    /* jshint camelcase: false */
    var token = request.query.access_token;
    /* jshint camelcase: true */

    serverStatus.removePackage++;
    isOwner(request.params.name, token, function (error, result) {
        if (error) {
            serverStatus.errors.removePackageQuery++;
            return response.send(error.status, error.message);
        }
        if (!result) {
            serverStatus.errors.notAuthorized++;
            return response.send(403, 'Must be a collaborator on GitHub.com repository');
        }

        database.deletePackage(request.params.name, function (error) {
            if (error) {
                serverStatus.errors.removePackageQuery++;
                return response.send(500, 'Database error');
            }
            response.send(204);
        });
    });
};

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
    var name = request.body.name;
    var url = request.body.url;

    serverStatus.createPackage++;

    if (!isValidName(name)) {
          serverStatus.errors.badName++;
          return response.send(400, 'Invalid Package Name');
    }

    validateURL(url, function(isValidURL) {
        if (isValidURL) {
            database.insertPackage(name, url, function (error) {
                if (error) {
                    serverStatus.errors.createPackageQuery++;
                    return response.send(403, 'Package already registered');
                }
                response.send(201);
            });
        } else {
            serverStatus.errors.badUrl++;
            response.send(400, 'Invalid URL');
        }
    });

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
            return response.send(404, 'Package not found');
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
