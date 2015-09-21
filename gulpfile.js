var Gulp = require('gulp');
var gulp = require('gulp-load-plugins')();

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
gulp.git.execAsync = Promise.promisify(gulp.git.exec);

Gulp.task('default', ['buildDevel']);
Gulp.task('buildDevel', ['buildSass'], buildDevel);
Gulp.task('buildProduction', ['buildSass'], buildProduction);
Gulp.task('buildCustom', ['bumpBuild'], buildCustom);
Gulp.task('buildSass', ['bumpBuild'], buildSass);
Gulp.task('bumpMajor', bumpVersion('major'));
Gulp.task('bumpMinor', bumpVersion('minor'));
Gulp.task('bumpPatch', bumpVersion('patch'));
Gulp.task('bumpBuild', bumpBuild);

//=== IMPLEMENTATION ===

function buildDevel() {
    deployVendor();
    deployCustom();
}

function buildProduction() {
    deployVendor(true);
    deployCustom(true);
}

function deployVendor(production) {
    var babelPolyfill = './node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js';

    var vendorLibsAdmin = [
        babelPolyfill,
        'public/libs/jquery/dist/jquery.js',
        'public/libs/jquery-color/jquery.color.js',
        'public/libs/lodash/lodash.js',
        'public/libs/hammerjs/hammer.js',
        'public/libs/moment/moment.js',
        'public/libs/moment/locale/ru.js',
        'public/libs/bootstrap/dist/js/bootstrap.js',
        'public/libs/bootstrap-select/js/bootstrap-select.js',
        'public/libs/bootstrap-daterangepicker/daterangepicker.js',
        'public/app/tmp/js/fileinput.js',
        'public/libs/angular/angular.js',
        'public/libs/angular-cookies/angular-cookies.js',
        'public/libs/angular-bootstrap/ui-bootstrap.js',
        'public/libs/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/libs/angular-bootstrap-select/dist/angular-bootstrap-select-tpls.js',
        'public/libs/angular-ui-mask/dist/mask.js',
        'public/libs/angular-daterangepicker/js/angular-daterangepicker.js',
        'public/libs/angular-smart-table/dist/smart-table.js',
        'public/libs/angular-toastr/dist/angular-toastr.tpls.js',
        'public/libs/angular-utils-pagination/dirPagination.js',
        'public/libs/ng-file-upload/ng-file-upload-all.js',
        'public/app/tmp/js/nsPopover.js',
        'public/libs/ryanmullins-angular-hammer/angular.hammer.js',
        'public/libs/tinycolor/tinycolor.js',
        'public/libs/angularjs-color-picker/angularjs-color-picker.js',
        'public/libs/sg.ui/dist/sg.ui.js'
    ];

    var vendorStylesAdmin = [
        'public/libs/bootstrap/dist/css/bootstrap.css',
        'public/libs/font-awesome/css/font-awesome.css',
        'public/libs/bootstrap-select/dist/css/bootstrap-select.css',
        'public/app/tmp/fileinput.css',
        'public/libs/bootstrap-daterangepicker/daterangepicker-bs3.css',
        'public/libs/angular-toastr/dist/angular-toastr.css',
        'public/libs/angularjs-color-picker/angularjs-color-picker.css'
    ];

    var vendorLibsMain = [
        babelPolyfill,
        'public/libs/jquery/dist/jquery.js',
        'public/libs/jquery-color/jquery.color.js',
        'public/libs/lodash/lodash.js',
        'public/libs/video.js/dist/video-js/video.dev.js',
        'public/libs/videojs-youtube/src/youtube.js',
        'public/libs/moment/min/moment-with-locales.js',
        'public/libs/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',,
        'public/libs/bootstrap/dist/js/bootstrap.js',
        'public/libs/bootstrap-select/js/bootstrap-select.js',
        'public/libs/angular/angular.js',
        'public/libs/angular-bootstrap-select/dist/angular-bootstrap-select-tpls.js',
        'public/libs/angular-route/angular-route.js',
        'public/libs/angular-cookies/angular-cookies.js',
        'public/libs/angular-animate/angular-animate.js',
        'public/libs/angular-bootstrap/ui-bootstrap.js',
        'public/libs/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/libs/angular-utils-pagination/dirPagination.js',
        'public/libs/angular-click-outside/clickoutside.directive.js',
        'public/libs/angular-simple-logger/dist/angular-simple-logger.js',
        'public/libs/angular-google-maps/dist/angular-google-maps.js',
        'public/libs/sg.ui/dist/sg.ui.js',
        'public/libs/angular-fx/src/js/angular-fx.js',
        'public/libs/angular-busy/dist/angular-busy.js',
        'public/libs/angular-ui-validate/dist/validate.js',
        'public/libs/angular-local-storage/dist/angular-local-storage.js'
    ];

    var vendorStylesMain = [
        'public/libs/bootstrap/dist/css/bootstrap.css',
        'public/libs/bootstrap-select/dist/css/bootstrap-select.css',
        'public/libs/font-awesome/css/font-awesome.css',
        'public/libs/video.js/dist/video-js/video-js.css',
        'public/libs/animate.css/animate.css',
        'public/libs/angular-fx/src/css/angular-fx.css',
        'public/libs/angular-busy/dist/angular-busy.css'
    ];

    var vendorLibsAuth = [
        babelPolyfill,
        'public/libs/lodash/lodash.js',
        'public/libs/angular/angular.js',
        'public/libs/angular-cookies/angular-cookies.js',
        'public/libs/angular-route/angular-route.js',
        'public/libs/angular-animate/angular-animate.js',
        'public/libs/angular-bootstrap/ui-bootstrap.js',
        'public/libs/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/libs/angular-busy/dist/angular-busy.js',
        'public/libs/angular-ui-validate/dist/validate.js'
    ];

    var vendorStylesAuth = [
        'public/libs/bootstrap/dist/css/bootstrap.css',
        'public/libs/font-awesome/css/font-awesome.css',
        'public/libs/animate.css/animate.css',
        'public/libs/angular-fx/src/css/angular-fx.css',
        'public/libs/angular-busy/dist/angular-busy.css'
    ];

    Gulp.src(vendorLibsAdmin)
        .pipe(gulp.concat('vendor-admin.min.js'))
        .pipe(gulp.if(production, gulp.uglify()))
        .pipe(Gulp.dest('public/scripts'));

    Gulp.src(vendorStylesAdmin)
        .pipe(gulp.concat('vendor-admin.min.css'))
        .pipe(gulp.minifyCss())
        .pipe(Gulp.dest('public/stylesheets'));

    Gulp.src(vendorLibsMain)
        .pipe(gulp.concat('vendor-main.min.js'))
        .pipe(gulp.if(production, gulp.uglify()))
        .pipe(Gulp.dest('public/scripts'));

    Gulp.src(vendorStylesMain)
        .pipe(gulp.concat('vendor-main.min.css'))
        .pipe(gulp.minifyCss())
        .pipe(Gulp.dest('public/stylesheets'));

    Gulp.src(vendorLibsAuth)
        .pipe(gulp.concat('vendor-auth.min.js'))
        .pipe(gulp.if(production, gulp.uglify()))
        .pipe(Gulp.dest('public/scripts'));

    Gulp.src(vendorStylesAuth)
        .pipe(gulp.concat('vendor-auth.min.css'))
        .pipe(gulp.minifyCss())
        .pipe(Gulp.dest('public/stylesheets'));
}

function deployCustom(production) {
    var customSourceAdmin = [
        'public/app/common/LoDash.provider.js',
        'public/app/common/INT/*.js',
        'public/app/common/jqCommon.js',
        'public/app/ngAdmin.js',
        'public/app/adminpage/**/*.js'
    ];

    var customSourceMain = [
        'public/app/common/**/*.js',
        'public/app/ngMainPage.js',
        'public/app/mainpage/**/*.js'
    ];

    var customSourceAuth = [
        'public/app/common/sgAuthSvc.js',
        'public/app/common/INT/*.js',
        'public/app/ngAuth.js',
        'public/app/auth/**/*.js'
    ];

    Gulp.src(customSourceAdmin)
        .pipe(gulp.sourcemaps.init())
        .pipe(gulp.babel())
        .pipe(gulp.concat('custom-admin.min.js'))
        .pipe(gulp.if(production, gulp.uglify()))
        .pipe(gulp.sourcemaps.write("."))
        .pipe(Gulp.dest('public/scripts'));

    Gulp.src(customSourceMain)
        .pipe(gulp.sourcemaps.init())
        .pipe(gulp.babel())
        .pipe(gulp.concat('custom-main.min.js'))
        .pipe(gulp.if(production, gulp.uglify()))
        .pipe(gulp.sourcemaps.write("."))
        .pipe(Gulp.dest('public/scripts'));

    Gulp.src(customSourceAuth)
        .pipe(gulp.sourcemaps.init())
        .pipe(gulp.concat('custom-auth.min.js'))
        .pipe(gulp.babel())
        .pipe(gulp.if(production, gulp.uglify()))
        .pipe(gulp.if(production, gulp.sourcemaps.write("../maps")))
        .pipe(Gulp.dest('public/scripts'));

}

function buildSass() {
    Gulp.src('public/sass/*.scss')
        .pipe(gulp.sourcemaps.init())
        .pipe(gulp.sass().on('error', gulp.sass.logError))
        .pipe(gulp.autoprefixer({
            browsers: ['last 2 versions', 'android > 4.0']
        }))
        .pipe(gulp.rename(function (path) {
            path.basename = 'custom-' + path.basename;
            path.extname = '.min.css';
        }))
        .pipe(gulp.minifyCss())
        .pipe(gulp.sourcemaps.write())
        .pipe(Gulp.dest('public/stylesheets'));
}

function bumpVersion(bumpType) {
    return function () {
        Gulp.src(['./package.json', './bower.json'])
            .pipe(gulp.bump({type: bumpType}))
            .pipe(Gulp.dest('./'))
            .pipe(gulp.git.commit("Bump package version"));
    }
}

function bumpBuild() {
    var build = {};
    var jsonFile = './build.json';

    return gulp.git
        .execAsync({args: 'rev-list HEAD --count'})
        .then(function (stdout) {
            build.commit = parseInt(stdout, 10);
            build.date = Date.now();
            return fs.writeFileAsync(jsonFile, JSON.stringify(build, null, 4));
        })
        .catch(function (err) {
            throw err;
        });
}

function buildCustom() {
    deployCustom();
}
