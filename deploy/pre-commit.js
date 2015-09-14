#!/usr/bin/env node
var fileName = './app.json';
require('child_process').exec('git rev-list HEAD --count < /dev/tty', function(err, stdout, stderr) {
    var numberOfCommits = parseInt(stdout, 10) + 1;
    try {
        var pkg = require(fileName);
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }

    pkg.commit = numberOfCommits;
    require('fs').writeFile(fileName, JSON.stringify(pkg, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + fileName);
        }
    });
});
