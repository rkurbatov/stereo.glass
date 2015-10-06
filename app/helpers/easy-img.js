module.exports = function(Promise) {
    var easyimg = require('easyimage');
    var fs = require('fs');
    var path = require('path');
    var FFMpeg = require('ffmpeg-wrap').FFMpeg;


    return {
        resizeOnUpload,
        convertImage
    };

    function resizeOnUpload(file) {
        return easyimg
            .info(file.path)
            .then((fileInfo)=> {
                if (fileInfo.width > 1200 || fileInfo.height > 800) {
                    let scale;
                    let formatObject = {
                        src: file.path,
                        dst: file.path
                    };

                    if (fileInfo.width > 1200) {
                        scale = fileInfo.width / 1200;
                        formatObject.width = 1200;
                        formatObject.height = Math.round(fileInfo.height / scale);
                    }
                    else {
                        scale = fileInfo.height / 800;
                        formatObject.width = Math.round(fileInfo.width / scale);
                        formatObject.height = 800;
                    }

                    console.log('resizing');
                    return easyimg.resize(formatObject);
                }
            })
            .then(()=> {
                return easyimg.thumbnail({
                    src: file.path,
                    dst: file.destination + '/thumb250-' + file.filename,
                    width: 250
                })
            })
    }

    function convertImage(file, format, layout) {
        return easyimg
            .info(file.path)
            .then((fileInfo)=> { // multiple filechecks before conversion
                let fileErr;

                if (fileInfo.type !== 'gif') {
                    fileErr = new Error('Wrong file type! Only gifs are possible!');
                    fileErr.code = 400;
                }

                if (format === 'gifmin' && fileInfo.size > 2 * 1024 * 1024) {
                    fileErr = new Error('File size is more than 2MB');
                    fileErr.code = 400;
                }

                if (format === 'mp4vid' && fileInfo.size > 20 * 1024 * 1024) {
                    fileErr = new Error('File size is more than 20MB');
                    fileErr.code = 400;
                }

                if (format === 'gifmin' && fileInfo.width > 250 && fileInfo.height > 250) {
                    fileErr = new Error('File dimensions should be 250 px at one side at least!');
                    fileErr.code = 400;
                }

                if (fileErr) {
                    console.log('removing %s', file.path);
                    fs.unlink(file.path);
                    throw fileErr;
                }
                return layout;
            })
            .then((layout)=>{
                // Should we convert gif to mp4
                if (format === 'mp4vid') {
                    // Node event to promise conversion
                    return new Promise((resolve, reject)=>{
                        var converter = new FFMpeg();
                        var outName = path.basename(file.filename, 'gif') + 'mp4';
                        converter
                            .input(file.path)
                            .output(file.destination + '/' + outName)
                            .run();

                        converter.on('end', ()=> {
                            layout.urlVideoHiRes = outName;
                            resolve(layout);
                        });
                        converter.on('error', (err)=> {
                            reject(err);
                            console.error("Can't convert GIF file: ", err);
                        });
                    });
                }
                
                return layout;
            })
            .then((layout)=> { // create static first frame
                console.log(file);
                return easyimg
                    .convert({
                        src: file.path + '[0]',
                        dst: file.destination + (format === 'mp4vid'
                            ? '/static-hi-'
                            : '/static-lo-') + path.basename(file.filename, 'gif') + 'jpg'
                    })
                    .then((result)=>{ // save name of static first frame
                        if (format === 'mp4vid') {
                            layout.urlStaticHiRes = result.name;
                        } else {
                            layout.urlThumbLoRes = result.name;
                        }
                        return layout;
                    })
                    .catch((err)=> {
                        console.log(err);
                    })
            });
    }

};