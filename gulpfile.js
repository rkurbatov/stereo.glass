var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');


gulp.task('default', ['buildDevel']);

gulp.task('buildDevel', function(){
    require('fs').writeFileSync('app/views/builddate.jade', '- var builddate = "' + Date.now() + '"');
    deployVendor();
    deployCustom();
});

gulp.task('buildProduction', function(){
    require('fs').writeFileSync('app/views/builddate.jade', '- var builddate = "' + Date.now() + '"');
    deployVendor(true);
    deployCustom(true);
});

gulp.task('deployVendor', deployVendor);
gulp.task('deployCustom', deployCustom);

function deployVendor(production) {
    var vendorLibsArrayAdmin = [
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

    var vendorStylesArrayAdmin = [
        'public/libs/bootstrap/dist/css/bootstrap.css',
        'public/libs/font-awesome/css/font-awesome.css',
        'public/libs/bootstrap-select/dist/css/bootstrap-select.css',
        'public/app/tmp/fileinput.css',
        'public/libs/bootstrap-daterangepicker/daterangepicker-bs3.css',
        'public/libs/angular-toastr/dist/angular-toastr.css',
        'public/libs/angularjs-color-picker/angularjs-color-picker.css'
    ];

    var vendorLibsArrayMain = [
        'public/libs/jquery/dist/jquery.min.js',
        'public/app/tmp/js/jquery.horizontalscroll.js',
        'public/app/tmp/js/jquery.touchswipe.js',
        'public/libs/lodash/lodash.min.js',
        'public/libs/angular/angular.min.js',
        'public/libs/angular-cookies/angular-cookies.js',
        'public/libs/sg.ui/build/sg.ui.js'
    ];

    var vendorStylesArrayMain = [
        'public/libs/bootstrap/dist/css/bootstrap.css',
        'public/libs/font-awesome/css/font-awesome.css'
    ];

    gulp.src(vendorLibsArrayAdmin)
        .pipe(concat('vendor-admin.min.js'))
        .pipe(gulpif(production, uglify()))
        .pipe(gulp.dest('public/scripts'));

    gulp.src(vendorStylesArrayAdmin)
        .pipe(concat('vendor-admin.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('public/stylesheets'));

    gulp.src(vendorLibsArrayMain)
        .pipe(concat('vendor-main.min.js'))
        .pipe(gulpif(production, uglify()))
        .pipe(gulp.dest('public/scripts'));

    gulp.src(vendorStylesArrayMain)
        .pipe(concat('vendor-main.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('public/stylesheets'));
}

function deployCustom(production) {
    var customSourceArrayAdmin = [
        'public/app/ngAdmin.js',
        'public/app/adminpage/**/*.js'
    ];

    var customStylesArrayAdmin = [
        'public/css/admin/admin.css'
    ];

    var customSourceArrayMain = [
        'public/app/jqMainPage.js',
        'public/app/ngMainPage.js',
        'public/app/mainpage/**/*.js'
    ];

    var customStylesArrayMain = [
        'public/css/screen.css'
    ];

    gulp.src(customSourceArrayAdmin)
        .pipe(concat('custom-admin.min.js'))
        .pipe(gulpif(production, uglify()))
        .pipe(gulp.dest('public/scripts'));

    gulp.src(customStylesArrayAdmin)
        .pipe(concat('custom-admin.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('public/stylesheets'));

    gulp.src(customSourceArrayMain)
        .pipe(concat('custom-main.min.js'))
        .pipe(gulpif(production, uglify()))
        .pipe(gulp.dest('public/scripts'));

    gulp.src(customStylesArrayMain)
        .pipe(concat('custom-main.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('public/stylesheets'));
}