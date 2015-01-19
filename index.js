'use strict';

if (process.env.NODE_ENV === 'production') {
    require('newrelic');
}

var express = require('express');
var cors = require('./lib/cors');
var config = require('config');
var multer  = require('multer');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var serverDomain = require('domain').create();

var app = express();

app.use(cors);
app.use(morgan('combined'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: './uploads/'}));

app.listen(config.get('port'));

exports.app = app;

require('./lib/routes');

app.use(errorHandler({ log: true }));

console.log(
    'This app is using port ' + config.get('port') +
    ' and the database url is ' + config.get('database.url') + '.'
);

//Tests look for this string to make sure the server is loaded
console.log('ready.');
