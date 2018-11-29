let gulp = require('gulp');
let babel = require('gulp-babel');
let uglify = require('gulp-uglify');

gulp.task('transpile', function() {
    return gulp
        .src('./src/test.js')
        .pipe(babel({"presets": ['es2015']}))
        .pipe(gulp.dest('./build/test.js'));
});