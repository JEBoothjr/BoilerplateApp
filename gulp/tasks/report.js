'use strict';

var gulp = require('gulp'),
    del = require('del'),
    plato = require('gulp-plato'),
    conf = require('../config');

//Remove previous code quality reports files
gulp.task('report:clean', function(callback) {
    del.sync(['./documentation/quality']);

    callback();
});

gulp.task('report', function() {
    return gulp.src(conf.SERVER_SOURCES)
        .pipe(plato('./documentation/quality', {
            jshint: {
                options: {
                    strict: true
                }
            },
            complexity: {
                trycatch: true
            }
        }));
});
