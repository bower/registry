var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

var codeFiles = ['**/*.js', '!node_modules/**'];
var testFiles = 'test/*.js';

gulp.task('lint', function () {
    gulp.src(codeFiles)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter());
});

gulp.task('test', function () {
    gulp.src(testFiles)
    .pipe(mocha({ reporter: 'spec'}));
});

gulp.task('default', ['lint', 'test']);
