module.exports = function (Promise, Language) {
    var fs = require('fs');
    var wrench = require('wrench');

    Promise.promisifyAll(fs);

    return {
        parse,
        updateDB
    };

    // === IMPLEMENTATION ===

    function parse() {
        var dirs = ['app/views/', 'public/app/'];

        // return array of filenames of all dirs with templates
        return Promise
            .all(dirs.map(getListOfFiles))
            .then((fileLists)=> {
                // flatten array of arrays
                var compositeList = [].concat.apply([], fileLists);
                return Promise.all(compositeList.map(parseSingleFile))
                    .then((arrayOfParsedStrings)=> {
                        // concatenate all arrays
                        return [].concat.apply([], arrayOfParsedStrings);
                    });
            });

        // Wrap sync function in promise
        function getListOfFiles(dirName) {
            return new Promise((resolve, reject)=> {
                var files = [];
                try {
                    files = wrench.readdirSyncRecursive(dirName);
                }
                catch (err) {
                    reject(err);
                }
                // return full path instead of filenames
                resolve(files.map((fileName)=>dirName + fileName));
            })
        }

        function parseSingleFile(fullFileName) {
            return fs.lstatAsync(fullFileName)
                .then((stats)=> {
                    // just empty array if directory
                    if (stats.isDirectory()) return [];
                    // otherwise parsed strings
                    return fs.readFileAsync(fullFileName, 'utf8')
                        .then((contents)=> {
                            var parsedValues = [];
                            // find all inclusions of _INT('something'); <== note explicit
                            // ';' even in templates
                            var re = /_INT\(("(.*)")(.*)?\)\;/g;
                            var match;
                            while ((match = re.exec(contents)) !== null) {
                                parsedValues.push(match[2]);
                            }
                            return parsedValues;
                        });
                })
        }
    }

    function updateDB(parsedStrings) {
        var hashes = parsedStrings.map(hashFnv32a);
        console.log(parsedStrings);
        console.log(hashes);
    }

    // function to calculate 32bit hash of string
    function hashFnv32a(str) {
        /*jshint bitwise:false */
        var i, l,
            hval = 0x811c9dc5;

        for (i = 0, l = str.length; i < l; i++) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        return hval >>> 0;
    }

};




