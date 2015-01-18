'use strict';

if (process.env.NODE_ENV === 'production') {
    require('newrelic');
}

var express = require('express');
var cors = require('./lib/cors');
var config = require('config');

var app = express();

app.configure(function () {
    app.use(cors);
    app.use(express.logger());
    app.use(express.compress());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.multipart());
    app.use(app.router);
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.listen(config.get('port'));

exports.app = app;

require('./lib/routes');

console.log(
    'This app is using port ' + config.get('port') +
    ' and the database url is ' + config.get('database.url') + '.'
);

//Tests look for this string to make sure the server is loaded
console.log('ready.');
