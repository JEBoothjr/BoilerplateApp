'use strict';

var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    exec = require('child_process').exec

gulp.task('db:app:setup', function(callback) {
    runSequence('db:app:clean', 'db:app:update', function() {
        callback();
    });
});

gulp.task('db:app:clean', function(callback) {
    exec('cqlsh -f ./server/cql/cleanAppKeyspace.cql', function(error, stdout, stderr) {
        if (stderr) {
            console.log(stderr);
        }
        callback();
    });
});

gulp.task('db:app:update', function(callback) {
    exec('cqlsh -k app -f ./server/cql/setupDB.cql', function(error, stdout, stderr) {
        if (stderr) {
            console.log(stderr);
        }
        callback();
    });
});

gulp.task('db:test:setup', function(callback) {
    runSequence('db:test:clean', 'db:test:update', function() {
        callback();
    });
});

gulp.task('db:test:clean', function(callback) {
    exec('cqlsh -f ./server/test/cql/cleanTestKeyspace.cql', function(error, stdout, stderr) {
        if (stderr) {
            console.log(stderr);
        }
        callback();
    });
});

gulp.task('db:test:update', function(callback) {
    exec('cqlsh -k test -f ./server/cql/setupDB.cql', function(error, stdout, stderr) {
        if (stderr) {
            console.log(stderr);
        }
        callback();
    });
});
