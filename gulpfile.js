var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

var browserSync = require('browser-sync');


gulp.task('default', ['buildDevel']);

gulp.task('buildDevel', function () {
    require('fs').writeFileSync('app/views/builddate.jade', '- var builddate = "' + Date.now() + '"');
    deployVendor();
    deployCustom();
});

gulp.task('buildProduction', function () {
    require('fs').writeFileSync('app/views/builddate.jade', '- var builddate = "' + Date.now() + '"');
    deployVendor(true);
    deployCustom(true);
});

gulp.task('deployVendor', deployVendor);
gulp.task('deployCustom', deployCustom);

gulp.task('serve', serve);

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
        'public/libs/sg.ui/build/sg.ui.js'
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
        'public/app/tmp/js/jquery.touchswipe.js',
        'public/libs/lodash/lodash.js',
        'public/libs/angular/angular.js',
        'public/libs/angular-route/angular-route.js',
        'public/libs/angular-cookies/angular-cookies.js',
        'public/libs/angular-animate/angular-animate.js',
        'public/libs/angular-bootstrap/ui-bootstrap.js',
        'public/libs/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/libs/angular-utils-pagination/dirPagination.js',
        'public/libs/sg.ui/build/sg.ui.js',
        'public/libs/angular-fx/src/js/angular-fx.js',
        'public/libs/angular-busy/dist/angular-busy.js',
        'public/libs/angular-ui-validate/dist/validate.js',
        'public/libs/angular-local-storage/dist/angular-local-storage.js'
    ];

    var vendorStylesMain = [
        'public/libs/bootstrap/dist/css/bootstrap.css',
        'public/libs/font-awesome/css/font-awesome.css',
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

    gulp.src(vendorLibsAdmin)
        .pipe(concat('vendor-admin.min.js'))
        .pipe(gulpif(production, uglify()))
        .pipe(gulp.dest('public/scripts'));

    gulp.src(vendorStylesAdmin)
        .pipe(concat('vendor-admin.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('public/stylesheets'));

    gulp.src(vendorLibsMain)
        .pipe(concat('vendor-main.min.js'))
        .pipe(gulpif(production, uglify()))
        .pipe(gulp.dest('public/scripts'));

    gulp.src(vendorStylesMain)
        .pipe(concat('vendor-main.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('public/stylesheets'));

    gulp.src(vendorLibsAuth)
        .pipe(concat('vendor-auth.min.js'))
        .pipe(gulpif(production, uglify()))
        .pipe(gulp.dest('public/scripts'));

    gulp.src(vendorStylesAuth)
        .pipe(concat('vendor-auth.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('public/stylesheets'));
}

function deployCustom(production) {
    var customSourceAdmin = [
        'public/app/common/LoDash.provider.js',
        'public/app/common/INT/*.js',
        'public/app/ngAdmin.js',
        'public/app/adminpage/**/*.js'
    ];

    var customStylesAdmin = [
        'public/css/admin/admin.css'
    ];

    var customSourceMain = [
        'public/app/common/**/*.js',
        'public/app/jqMainPage.js',
        'public/app/ngMainPage.js',
        'public/app/mainpage/**/*.js'
    ];

    var customStylesMain = [
        'public/css/mainpage/mainpage.css'
    ];

    var customSourceAuth = [
        'public/app/common/sgAuthSvc.js',
        'public/app/common/INT/*.js',
        'public/app/ngAuth.js',
        'public/app/auth/**/*.js'
    ];

    var customStylesAuth = [
        'public/css/auth/auth.css'
    ];

    gulp.src(customSourceAdmin)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('custom-admin.min.js'))
        .pipe(gulpif(production, uglify()))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('public/scripts'));

    gulp.src(customStylesAdmin)
        .pipe(concat('custom-admin.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('public/stylesheets'));

    gulp.src(customSourceMain)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('custom-main.min.js'))
        .pipe(gulpif(production, uglify()))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('public/scripts'));

    gulp.src(customStylesMain)
        .pipe(concat('custom-main.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('public/stylesheets'));

    gulp.src(customSourceAuth)
        .pipe(gulpif(production, sourcemaps.init()))
        .pipe(babel())
        .pipe(concat('custom-auth.min.js'))
        .pipe(gulpif(production, uglify()))
        .pipe(gulpif(production, sourcemaps.write(".")))
        .pipe(gulp.dest('public/scripts'));

    gulp.src(customStylesAuth)
        .pipe(concat('custom-auth.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('public/stylesheets'));
}

function serve() {
    browserSync.init({
        notify: false,
        port: 9999,
        server: {

        }
    });
}