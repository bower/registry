'use strict';

var config = require('config');

var serverStatus = require('../status');
var database = require('../database');
var isValidName = require('../validName');
var validateURL = require('../validURL');
var normalizeURL = require('../normalizeURL');
var url = require('url');
var path = require('path');
var GithubClient = require('github');
var request = require('request');

var memcached = require('../memcached');

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

                    return callback({
                        status: error.code,
                        message: JSON.parse(error.message).message
                    });
                }
                callback(null, true);
            };
        }

        function getNewPath(path, cb) {
          var url = "http://github.com" + path;

          request.head(url, function(e, res) {
            if (e) cb(e);
            cb(null, res.req.path);
          });
        }

        getNewPath("/" + owner + "/" + repo, function (error, path) {
            if (error) {
                return callback({ status: 500, message: 'Error fetching GitHub repository path' });
            }

            var pathParts = path.split('/');
            var owner = pathParts[1];
            var repo = pathParts[2];

            githubClient.user.get({}, function (error, user) {
                if (error) {
                    return callback({ status: 500, message: 'Error fetching GitHub user info' });
                }
                githubClient.repos.getCollaborator({
                    user: owner,
                    repo: repo,
                    collabuser: user.login
                }, ghCheck(function () {
                    if (config.has('registryEditorsID')) {
                        githubClient.orgs.getTeamMember({
                            id: config.get('registryEditorsID'),
                            user: user.login
                        }, ghCheck(function () {
                            callback(null, false);
                        }));
                    } else {
                        callback(null, false);
                    }
                }));
            });
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
            return response.status(error.status).send(error.message);
        }
        if (!result) {
            serverStatus.errors.notAuthorized++;
            return response.status(403).send('Must be a collaborator on GitHub.com repository');
        }

        database.deletePackage(request.params.name, function (error) {
            if (error) {
                serverStatus.errors.removePackageQuery++;
                return response.status(500).send('Database error');
            }

            response.status(204).end();
        });
    });
};

exports.list = function (request, response) {
    response.setHeader('Content-Type', 'application/json');

    serverStatus.allPackages++;

    memcached.get('packages', function (error, value, key) {
        if (error) {
            serverStatus.errors.allPackagesQuery++;
            return response.status(500).send('Memcached read error');
        }

        if (value) {
            response.send(value);
        } else {
            database.getPackages(function (error, result) {
                if (error) {
                    serverStatus.errors.allPackagesQuery++;
                    return response.status(500).send('Database error');
                }

                memcached.set('packages', JSON.stringify(result.rows), function(error, value) {
                    if (error) {
                        serverStatus.errors.allPackagesQuery++;
                        return response.status(500).send('Memcached write error');
                    }

                    return exports.list(request, response);
                }, 600);
            });
        }
    });
};

exports.create = function (request, response) {
    var name = request.body.name;
    var url = normalizeURL(request.body.url);
    var validation = isValidName(name);

    serverStatus.createPackage++;

    if (validation.error) {
          serverStatus.errors.badName++;
          return response.status(400).send('Invalid Package Name. ' + validation.error);
    }

    validateURL(url, function(isValidURL) {
        if (isValidURL) {
            database.insertPackage(name, url, function (error) {
                if (error) {
                    serverStatus.errors.createPackageQuery++;
                    return response.status(403).send('Package already registered');
                }

                response.status(201).end();
            });
        } else {
            serverStatus.errors.badUrl++;
            response.status(400).send('Invalid URL');
        }
    });

};

exports.fetch = function (request, response) {
    serverStatus.getPackage++;
    database.getPackage(request.params.name, function (error, result) {
        if (error) {
            serverStatus.errors.getPackageQuery++;
            return response.status(500).send('Database error');
        }
        if (result.rows.length === 0) {
            serverStatus.errors.notFound++;
            return response.status(404).send('Package not found');
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
            return response.status(500).send('Database error');
        }
        response.send(result.rows);
    });
};
