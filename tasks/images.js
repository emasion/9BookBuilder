/**
 * Created by Davinci28 on 2014-10-31.
 */
'use strict'

var gulp = require('gulp')
var conf = require('../config/gulp.config')
var imagemin = require('gulp-imagemin')
var plumber = require('gulp-plumber')

gulp.task('images', function() {
	return gulp.src(conf.paths.src.images)
		.pipe(plumber())
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(conf.paths.dist.images))
})