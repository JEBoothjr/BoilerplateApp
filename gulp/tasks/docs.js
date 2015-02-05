'use strict';

var gulp = require('gulp'),
    apidoc = require('gulp-apidoc');

//Remove previous generated api docs
gulp.task('docs:clean', function(callback) {
    del.sync(['./documentation/docs']);

    callback();
});

/*
Generates documentation
 */
gulp.task('docs', function() {
    apidoc.exec({
        src: './server/routers/',
        dest: './documentation/api/'
    });
});
