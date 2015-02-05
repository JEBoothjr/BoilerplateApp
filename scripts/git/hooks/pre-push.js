#!/usr/bin/env node

var spawn = require('child_process').spawn,
    path = require("path"),
    proc;

var isWin = /^win/.test(process.platform),
    rCommand = isWin ? 'gulp.cmd' : 'gulp';

proc = spawn(rCommand, [], {
    cwd: path.resolve(__dirname + '/../../'),
    stdio: "inherit"
});

// proc.stdout.on('data', function(data) {
//     process.stdout.write(data);
// });

// proc.stderr.on('data', function(data) {
//     process.stderr.write(data);
// });

proc.on('close', function(code) {
    process.exit(code);
});
