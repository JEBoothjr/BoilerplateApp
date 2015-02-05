'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    argv = require('yargs').argv,
    conf = require('../config');

//Run jshint on the server code
gulp.task('jshint:server', function(callback) {
    var sources = (argv.sources) ? argv.sources.split(':') : conf.SERVER_SOURCES.concat(conf.SERVER_TESTS);

    return gulp.src(sources)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

//Run jshint on the client code
gulp.task('jshint:client', function(callback) {
    var sources = (argv.sources) ? argv.sources.split(':') : conf.CLIENT_SOURCES;

    return gulp.src(sources)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});
