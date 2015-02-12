'use strict';

//process.env.BROWSERIFYSHIM_DIAGNOSTICS = 1;

var gulp = require('gulp'),
    async = require('async'),
    del = require('del'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    conf = require('../config');

//Remove previous public files
gulp.task('build:clean', function(callback) {
    del.sync(['./server/public/**']);

    callback();
});


//https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md
// var getBundleName = function() {
//     var version = require('./package.json').version,
//         name = require('./package.json').name;

//     return version + '.' + name + '.' + 'min';
// };

var _packageJSBundle = function(bundleInfo, callback) {
    var bundler = watchify(browserify({
            entries: bundleInfo.js.files,
            extensions: ['.js']
        })),
        bundle = function(cb) {
            return bundler
                .bundle()
                .on('error', gutil.log.bind(gutil, 'Browserify Error'))
                //.pipe(source(getBundleName() + '.js'))
                .pipe(source(bundleInfo.js.name))
                .pipe(buffer())
                .pipe(sourcemaps.init({
                    loadMaps: true
                }))
                // Add transformation tasks to the pipeline here.
                .pipe(uglify())
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest('./server/public/js/'))
                .on('end', cb);
        };

    bundler.on('update', function(ids) {
        console.time("REBUILDING: " + ids);
        bundle(function() {
            console.timeEnd("REBUILDING: " + ids);
        });
    });

    return bundle(callback);
};

var _packageCSSBundle = function(bundleInfo, callback) {
    gulp.src(bundleInfo.css.files)
        .pipe(sourcemaps.init())
        .pipe(minifyCSS({
            processImport: true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./server/public/css/'))
        .on('end', callback);
};

gulp.task('build:package', function(callback) {
    conf.isWatching = true;

    var bundles = [{
        js: {
            name: 'setup.js',
            files: ['./client/js/setup.js']
        },
        css: {
            name: 'setup.css',
            files: ['./client/css/setup.css']
        }
    }, {
        js: {
            name: 'vendor.js',
            files: ['./client/js/vendor.js', './bower_components/jquery/jquery.js', './bower_components/underscore/underscore.js', './node_modules/backbone/backbone.js', './bower_components/react/react.js'],
            alias: []
        }
    }];
    async.eachSeries(bundles, function(bundle, callback) {
        async.series([
            function(callback) {
                _packageJSBundle(bundle, callback);
            },
            function(callback) {
                if (bundle.css) {
                    _packageCSSBundle(bundle, callback);
                } else {
                    callback();
                }
            }
        ], function(err) {
            callback(err);
        });
    }, function(err) {
        callback(err);
    });
});

gulp.task('build:copyFiles', function() {
    return gulp.src('./client/index.html')
        .pipe(gulp.dest('./server/public'));
});

gulp.task('build', ['build:clean', 'build:package', 'build:copyFiles']);
