var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('copy', function() {

    gulp.src(['src/**/**/**/*.js', 'src/img/*'])
        .pipe(gulp.dest('dist/'));

});