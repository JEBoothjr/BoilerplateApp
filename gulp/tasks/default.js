'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    conf = require('../config');

/*
 * The task gets stuck. This quits it.
 */
gulp.on('stop', function() {
    if (!conf.isWatching) {
        process.nextTick(function() {
            process.exit(0);
        });
    }
});

gulp.task('default', ['docs', 'jshint:server', 'coverage']);
gulp.task('commit', ['jshint:server']);
gulp.task('setup', ['githhooks:update']);

gulp.task('develop', ['build'], function() {
    conf.isWatching = true;

    gulp.watch(conf.CLIENT_WATCH, ['build']);

    nodemon()
        .on('restart', function(files) {
            console.log(files);
        });
});
