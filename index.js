'use strict';

var express = require('express');

var app = express();
var assert = require('assert');

assert.notStrictEqual(
    process.env.PORT,
    undefined,
    'Please export a $PORT environment variable'
);
assert.notStrictEqual(
    process.env.DATABASE_URL,
    undefined,
    'Please export a $DATABASE_URL environment variable'
);

app.configure(function () {
    app.use(express.logger());
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.listen(process.env.PORT);

exports.app = app;
require('./lib/routes');

console.log('ready.');
