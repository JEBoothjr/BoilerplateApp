'use strict';

var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    mocha = require('gulp-mocha'),
    argv = require('yargs').argv,
    conf = require('../config');

//Run the tests only.
gulp.task('test', function(callback) {
    runSequence('env:test', 'db:test:setup', 'test_internal', callback);
});

//Not meant to be run by itself, but in 'test'. run-sequence doesn't like it if its in the callback as it hangs.
gulp.task('test_internal', function(callback) {
    var testFiles = (argv.tests) ? argv.tests.split(':') : conf.SERVER_TESTS,
        grep = (argv.grep) ? argv.grep : '';

    return gulp.src(testFiles)
        .pipe(mocha({
            reporter: 'spec',
            timeout: 30000,
            grep: grep
        }));
});
