module.exports = {
    parse
};

var fs = require('fs');
var Promise = require('bluebird');
var wrench = require('wrench');

Promise.promisifyAll(fs);

function parse() {
    var dirs = ['app/views/', 'public/app/'];

    dirs.forEach((dirName)=>{
        // get list of files in views and code directory
        var files = wrench.readdirSyncRecursive(dirName);
        files.forEach(function (fileName) {
            if (!fs.lstatSync(dirName + fileName).isDirectory()) {
                fs
                    .readFileAsync(dirName + fileName, 'utf8')
                    .then((file)=> {
                        // find all inclusions of _INT('something'); <== note explicit
                        // ';' even in templates
                        var re = /_INT\(("(.*)")(.*)?\)\;/g;
                        var match;
                        while ((match = re.exec(file)) !== null) {
                            console.log(match[2]);
                        }
                    })
                    .catch((err)=> {
                        console.log("Can't parse files: ", err);
                    });
            }
        });
    });

}