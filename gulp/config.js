'use strict';

module.exports = {
    isWatching: false, //If we are watching, set this to true in the watch method

    SERVER_SOURCES: [
        './server/models/**/*.js',
        './server/lib/**/*.js',
        './server/utils/**/*.js',
        './server/services/**/*.js',
        './server/middleware/**/*.js',
        './server/routers/**/*.js',
        './server/app.js',
        '!./server/routers/authRouter.js', //TODO : Excluded for now, since they are placeholders
        '!./server/routers/siteRouter.js' //TODO : Excluded for now, since they are placeholders
    ],
    SERVER_TESTS: [
        './server/test/**/*.js',
        '!./server/test/**/flow*.js'
    ],
    CLIENT_SOURCES: [
        './client/js/**/*.js',
        './client/css/**/*.css'
    ],
    CLIENT_WATCH: [
        './client/**/*.js',
        './client/**/*.css',
        './client/**/*.html'
    ],
    SERVER_WATCH: [
        './server/views/**/*.handlebars',
        './server/views/**/*.js'
    ]
};
