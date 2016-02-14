'use strict';

if (process.env.NODE_ENV === 'production') {
    require('newrelic');
}

var express = require('express');
var cors = require('./lib/cors');
var config = require('config');
var multer  = require('multer')({ limits: { files : 0 } });
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var onFinished = require('on-finished');

var app = express();

var firstMemory = undefined;

if (typeof global.gc === 'function') {
    app.use(function (req, res, next) {
        if (firstMemory === undefined) {
            firstMemory = process.memoryUsage().rss * 2;
        }

        if(req.url === '/packages') {
            onFinished(res, function (err, res) {
                var usage = process.memoryUsage().rss;

                // Collect garbage only if we need to
                if (usage > firstMemory * 2) {
                    console.log('COLLECTING GARBAGE!');
                    setTimeout(function() {
                        global.gc();
                    });
                };
            });
        }

        next();
    });
} else {
    console.log('Garbage collector not exposed!');
}

app.enable('strict routing');
app.enable('trust proxy');

app.use(cors);
app.use(morgan('combined', {
    skip: function (req, res) {
        return res.statusCode === 200;
    }
}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer.any());

app.listen(config.get('port'));

exports.app = app;

require('./lib/routes')(app);

console.log(
    'This app is using port ' + config.get('port') +
    ' and the database url is ' + config.get('database.url') + '.'
);

//Tests look for this string to make sure the server is loaded
console.log('ready.');
