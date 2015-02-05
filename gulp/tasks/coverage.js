'use strict';

var gulp = require('gulp'),
    del = require('del'),
    argv = require('yargs').argv,
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    runSequence = require('run-sequence'),
    conf = require('../config');

//Remove previous server code coverage files
gulp.task('coverage:server:clean', function(callback) {
    var outputDirectory = (argv.sources) ? 'server/file' : 'server/all';

    del.sync(['./documentation/coverage/' + outputDirectory]);

    callback();
});

//Does a complete test cleanup, runs jshint on node.js code, runs tests and generates coverage reports.
//You can run coverage on a single file by using the following arguments:
//gulp coverage --sources=server/services/myService.js --tests=server/test/myService_Test.js
//colon (:) was chosen as the delimiter to allow auto-complete of paths
gulp.task('coverage:server', function(callback) {
    var sourceFiles = (argv.sources) ? argv.sources.split(':') : conf.SERVER_SOURCES,
        testFiles = (argv.tests) ? argv.tests.split(':') : conf.SERVER_TESTS,
        outputDirectory = (argv.sources) ? 'server/file' : 'server/all',
        grep = (argv.grep) ? argv.grep : '';

    gulp.src(sourceFiles, {
            base: './server'
        })
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .pipe(gulp.dest('./documentation/coverage/' + outputDirectory + '/src'))
        .on('end', function() {
            return gulp.src(testFiles)
                .pipe(mocha({
                    reporter: 'spec',
                    timeout: 30000,
                    grep: grep
                }))
                .pipe(istanbul.writeReports('./documentation/coverage/' + outputDirectory))
                .on('end', callback);
        });
});

//Remove previous client code coverage files
gulp.task('coverage:client:clean', function(callback) {
    var outputDirectory = (argv.sources) ? 'client/file' : 'client/all';

    del.sync(['./documentation/coverage/' + outputDirectory]);

    callback();
});

gulp.task('coverage:client', function(callback) {
    var sourceFiles = (argv.sources) ? argv.sources.split(':') : conf.CLIENT_SOURCES,
        testFiles = (argv.tests) ? argv.tests.split(':') : conf.CLIENT_TESTS,
        outputDirectory = (argv.sources) ? 'client/file' : 'client/all',
        grep = (argv.grep) ? argv.grep : '';

    gulp.src(sourceFiles, {
            base: './client'
        })
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .pipe(gulp.dest('./documentation/coverage/' + outputDirectory + '/src'))
        .on('end', function() {
            return gulp.src(testFiles)
                .pipe(mocha({
                    reporter: 'spec',
                    timeout: 30000,
                    grep: grep
                }))
                .pipe(istanbul.writeReports('./documentation/coverage/' + outputDirectory))
                .on('end', callback);
        });
});

gulp.task('coverage', function(callback) {
    runSequence('env:test', 'db:test:clean', 'db:test:update', 'coverage:server:clean', 'coverage:server', 'enforce:coverage:server', callback);
});
