/**
 * Created by Davinci28 on 2014-10-29.
 */
'use strict'

var gulp = require('gulp')
var conf = require('../config/gulp.config')
var plumber = require('gulp-plumber')
var autoprefixer = require('gulp-autoprefixer')
var size = require('gulp-size')

gulp.task('styles', function() {
	return gulp.src(conf.paths.src.styles)
		.pipe(plumber())
		.pipe(autoprefixer())
		.pipe(gulp.dest(conf.paths.dist.styles))
		.pipe(size({ title: 'styles' }))
})