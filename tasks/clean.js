
'use strict'

var gulp = require('gulp')
var conf = require('../config/gulp.config')
var del = require('del')
var vinylPaths = require('vinyl-paths')

/* clean */
gulp.task('clean', function() {
	return gulp.src([TMP_DIR, conf.paths.src.tmp], { read: false })
		.pipe(vinylPaths(del))
})

/* clean:public */
gulp.task('clean:public', function() {
	return gulp.src([conf.paths.public.pages, conf.paths.public.thumbs], { read: false })
		.pipe(vinylPaths(del))
})

/* clean:dist */
gulp.task('clean:dist', function() {
	return gulp.src([BUILD_DIR], { read: false })
		.pipe(vinylPaths(del))
})