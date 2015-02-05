'use strict';

var gulp = require('gulp'),
    coverageEnforcer = require('gulp-istanbul-enforcer'),
    argv = require('yargs').argv;

gulp.task('enforce:coverage:server', function(callback) {
    var outputDirectory = (argv.sources) ? 'server/file' : 'server/all',
        options = {
            thresholds: {
                statements: 100,
                branches: 100,
                lines: 100,
                functions: 100
            },
            coverageDirectory: './documentation/coverage/' + outputDirectory,
            rootDirectory: ''
        };
    gulp
        .src('.')
        .pipe(coverageEnforcer(options))
        .on('end', callback);
});

gulp.task('enforce:coverage:client', function(callback) {
    var outputDirectory = (argv.sources) ? 'client/file' : 'client/all',
        options = {
            thresholds: {
                statements: 100,
                branches: 100,
                lines: 100,
                functions: 100
            },
            coverageDirectory: './documentation/coverage/' + outputDirectory,
            rootDirectory: ''
        };
    gulp
        .src('.')
        .pipe(coverageEnforcer(options))
        .on('end', callback);
});
