var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var concat = require('gulp-concat');
var notify = require('gulp-notify');

gulp.task('deployVendor', deployVendor);
gulp.task('deployCustom', deployCustom);

function deployVendor() {
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
        'public/libs/angular-daterangepicker-plus/src/angular-daterangepicker-plus.js',
        'public/libs/angular-smart-table/dist/smart-table.js',
        'public/libs/angular-toastr/dist/angular-toastr.tpls.js',
        'public/libs/angular-utils-pagination/dirPagination.js',
        'public/libs/ng-file-upload/ng-file-upload.js',
        'public/libs/ryanmullins-angular-hammer/angular.hammer.js',
        'public/libs/sg.ui/build/sg.ui.js'
    ];

    var vendorStylesArrayAdmin = [
        'public/libs/bootstrap/dist/css/bootstrap.css',
        'public/libs/font-awesome/css/font-awesome.css',
        'public/libs/bootstrap-select/dist/css/bootstrap-select.css',
        'public/app/tmp/fileinput.css',
        'public/libs/bootstrap-daterangepicker/daterangepicker-bs3.css'
    ];

    gulp.src(vendorLibsArrayAdmin)
        .pipe(concat('vendor-admin.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/scripts'));

    gulp.src(vendorStylesArrayAdmin)
        .pipe(concat('vendor-admin.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('public/stylesheets'));
}

function deployCustom() {
    var customStylesArrayAdmin = [
        'public/css/admin/admin.css'
    ];

    gulp.src([
        'public/app/ngAdmin.js',
        'public/app/adminpage/**/*.js'
    ])
        .pipe(concat('custom-admin.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('public/scripts'));

    gulp.src(customStylesArrayAdmin)
        .pipe(concat('custom-admin.min.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('public/stylesheets'));
}