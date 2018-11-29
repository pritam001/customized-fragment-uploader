var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
let source = require('vinyl-source-stream');

gulp.task('scripts', () => {
    browserify(['src/test.js'])
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js')
        .pipe(gulp.dest('dist/scripts')))
});