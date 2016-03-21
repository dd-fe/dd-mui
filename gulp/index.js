var gulp = require('gulp');

require('./task/server.js');
require('./task/copy.js');
require('./task/less.js');

gulp.task('default', [
    'server'
]);

gulp.task('release', [
    'copy', 'less'
]);