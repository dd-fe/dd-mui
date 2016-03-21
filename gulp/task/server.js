var gulp = require('gulp');
var server = require('gulp-server-livereload');

gulp.task('server', function() {
    console.log('ddd')
    gulp.src('')
        .pipe(server({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});