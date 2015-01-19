var Promise = require('bluebird');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var config = require('config');
var minimist = require('minimist');

var database = require('./lib/database');

var codeFiles = ['**/*.js', '!node_modules/**'];
var testFiles = 'test/*.js';

gulp.task('lint', function () {
    gulp.src(codeFiles)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter());
});

gulp.task('db:migrate', database.migrate);
gulp.task('db:rollback', database.rollback);
gulp.task('db:truncate', database.truncate);
gulp.task('db:create', database.createDatabase);
gulp.task('db:drop', database.dropDatabase);

gulp.task('migration', function () {
    var options = minimist(process.argv.slice(2), {
        string: 'name'
    });

    if (!options.name) {
        throw '--name flag is required';
    }

    return execute(function (knex) {
        return knex.migrate.make(options.name);
    });
});

gulp.task('default', ['lint', 'test']);
