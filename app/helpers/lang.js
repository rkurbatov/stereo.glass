module.exports = function (Promise, Language) {
    var fs = require('fs');
    var wrench = require('wrench');
    var _ = require('lodash');

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
            })
            .catch((err)=>{
                console.log(err);
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
        var newHashes = parsedStrings.map(hashFnv32a);
        return Language.find({})
            .then((languages)=> {
                if (!languages.length) {
                    var err = new Error('Language list is empty');
                    err.status = 404;
                    throw err;
                }

                return Promise.all(languages.map(updateLanguage));
            });

        function updateLanguage(language) {
            var existingHashes = _.map(language.data, 'hash');
            var addedHashes = _.difference(newHashes, existingHashes);
            var removedHashes = _.difference(existingHashes, newHashes);
            var unchangedHashes = _.intersection(newHashes, existingHashes);

            // mark all returned strings
            _.each(unchangedHashes, (hash)=> {
                var idx = existingHashes.indexOf(hash);
                if (language.data[idx].status === 'x') {
                    // returned translation
                    var idx2 = newHashes.indexOf(hash);
                    // set original text for new original text (for case of dup. hash)
                    language.data[idx].sr = parsedStrings[idx2].sr;
                    language.data[idx].status = '~';
                }
            });

            // mark all removed strings as 'x"
            _.each(removedHashes, (hash)=> {
                var idx = existingHashes.indexOf(hash);
                language.data[idx].status = 'x';
            });

            // add new translations (empty and only for russian just values)
            _.each(addedHashes, (hash)=> {
                var newTranslation = {hash};                // create empty translation one
                var idx = newHashes.indexOf(hash);
                newTranslation.sr = parsedStrings[idx];
                if (language.code === 'RU') {
                    newTranslation.tr = newTranslation.sr;
                    newTranslation.status = '!';            // russian translation is just copy of source
                } else {
                    newTranslation.status = '+';            // mark as non-translated
                }
                language.data.push(newTranslation);
            });

            return language.save();

        }
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




