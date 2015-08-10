module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],

        files: [
            'public/app/common/_INT.js',
            'test/**/*.spec.js'
        ]
    });
};