'use strict';

var gulp = require('gulp');

gulp.task('env:test', function(callback) {
    process.env.NODE_ENV = "test";
    callback();
});

//Set the environment variable to development for the gulp process ONLY
gulp.task('env:dev', function(callback) {
    process.env.NODE_ENV = "development";
    callback();
});

//Set the environment variable to staging for the gulp process ONLY
gulp.task('env:stg', function(callback) {
    process.env.NODE_ENV = "staging";
    callback();
});

//Set the environment variable to production for the gulp process ONLY
gulp.task('env:prod', function(callback) {
    process.env.NODE_ENV = "production";
    callback();
});
