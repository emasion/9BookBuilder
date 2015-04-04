
'use strict'

var gulp = require('gulp')
var conf = require('../config/gulp.config')
var wiredep = require('wiredep').stream
var preprocess = require('gulp-preprocess')
var uglify = require('gulp-uglify')
var minifyCss = require('gulp-minify-css')
var minifyHtml = require('gulp-minify-html')
var usemin = require('gulp-usemin')
var size = require('gulp-size')

gulp.task('inject', function() {
	return gulp.src(conf.paths.src.html)
		/* bower package 들을 html에 include */
		.pipe(wiredep({
			directory: BOWER_DIR
		}))
		.pipe(preprocess())
		.pipe(gulp.dest(TMP_DIR))
		.pipe(size({ title: 'inject' }))
})

gulp.task('usemin', ['inject'], function() {
	gulp.src(conf.paths.tmp.html)
		.pipe(usemin({
			css: [minifyCss(), 'concat'],
			html: [minifyHtml({empty: true})]
		}))
		.pipe(gulp.dest(BUILD_DIR))
		.pipe(size({ title: 'usemin' }))
})
