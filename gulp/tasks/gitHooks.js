'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    path = require('path');

/**
 * Creates git hooks to run jshint on commits and test coverage on push
 */
gulp.task('githhooks:update', function(callback) {
    var hookFiles = ['./scripts/git/hooks/pre-push.js', './scripts/git/hooks/pre-commit.js', './scripts/git/hooks/commit-msg.js'],
        i,
        file,
        hookFile,
        hookName,
        hookPath,
        pattern = /[^/]+.js/i;

    for (i = 0; i < hookFiles.length; i++) {
        hookFile = pattern.exec(hookFiles[i])[0];
        hookName = hookFile.split('.')[0];
        hookPath = path.resolve('.git/hooks/' + hookName);
        file = fs.readFileSync(hookFiles[i]);
        fs.writeFileSync(hookPath, file);
        fs.chmodSync(hookPath, '755');

        console.log("Created " + hookName + " hook.");
    }

    callback();
});
