#!/usr/bin/env node

var exec = require('child_process').exec,
    util = require('util'),
    fs = require('fs'),
    contents = null,
    msg_filepath = '.git/COMMIT_EDITMSG',
    branch, ticket, output, branchname;

console.log("Processing Commit Message...");

if (fs.existsSync(msg_filepath)) {
    // get the current branch name
    branch = exec("git rev-parse --abbrev-ref HEAD",
        function(err, stdout, stderr) {
            if (err) {
                process.exit(0);
            }

            branchname = stdout;
            branchname = branchname.replace('\n', '');

            // opens .git/COMMIT_EDITMSG
            contents = fs.readFileSync(msg_filepath, {
                encoding: 'utf8'
            });

            // '(no branch)' indicates we are in a rebase or other non-HEAD scenario
            if (stdout !== '(no branch)') {
                contents = contents.replace(/^[A-Z]*-[0-9]*\s*:?\s*/gi, '');

                //Get just the branchname name
                var ticket = branchname.split("/");
                ticket = ticket[1] || ticket[0];

                // Append branch name to original contents.
                output = ticket + ": " + contents;

                // write contents back out to .git/COMMIT_EDITMSG
                fs.writeFileSync(msg_filepath, output);
                process.exit(0);
            } else {
                process.exit(0);
            }
        });
}
