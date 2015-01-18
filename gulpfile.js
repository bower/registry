var Promise = require('bluebird');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var config = require('config');
var minimist = require('minimist');
var pg = require('pg');
var parseDatabaseUrl = require('parse-database-url');

var parsedUrl = parseDatabaseUrl(config.get('database.url'));

var execute = function (builder) {
    var knex = require('knex')({
        client: 'pg',
        connection: config.get('database.url'),
        pool: { max: 0 }
    });

    return builder(knex).then(
        function (result) { knex.destroy(); return result; },
        function (reason) { knex.destroy(); throw reason; }
    );
};

var executeAdmin = Promise.promisify(function (query, done) {
    var client = new pg.Client({
        user: parsedUrl.user,
        password: parsedUrl.password,
        database: 'postgres',
        dialect: 'postgres'
    });

    client.connect(function(err) {
        if (err) return done(err);

        return client.query(query, function(err, result) {
            if (err) {
                done(err);
            }
            client.end();
            done(null, result);
        });
    });
});

var codeFiles = ['**/*.js', '!node_modules/**'];
var testFiles = 'test/*.js';

var options = minimist(process.argv.slice(2), {
    string: 'name'
});

gulp.task('lint', function () {
    gulp.src(codeFiles)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter());
});

gulp.task('test', function () {
    gulp.src(testFiles)
    .pipe(mocha({ reporter: 'spec'}));
});

gulp.task('db:migrate', function () {
    return execute(function (knex) {
        return knex.migrate.latest();
    });
});

gulp.task('db:rollback', function () {
    return execute(function (knex) {
        return knex.migrate.rollback();
    });
});

gulp.task('migration', function () {
    if (!options.name) {
        throw "--name flag is required";
    }

    return execute(function (knex) {
        return knex.migrate.make(options.name);
    });
});

gulp.task('db:create', function (cb) {
    if (!parsedUrl.database) {
        throw "Correct DATABASE_URL is required";
    }

    return executeAdmin("CREATE DATABASE " + parsedUrl.database);
});

gulp.task('db:drop', function (cb) {
    if (!parsedUrl.database) {
        throw "Correct DATABASE_URL is required";
    }

    return executeAdmin("DROP DATABASE " + parsedUrl.database);
});

gulp.task('default', ['lint', 'test']);
