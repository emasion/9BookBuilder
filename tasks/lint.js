
'use strict'

var gulp = require('gulp')
var conf = require('../config/gulp.config')
var jshint = require('gulp-jshint')

/* jshint */
gulp.task('lint', function() {
	return gulp.src(conf.paths.src.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
})