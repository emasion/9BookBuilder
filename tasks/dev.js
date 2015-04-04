
'use strict'

var gulp = require('gulp')
var conf = require('../config/gulp.config')
var runSequence = require('run-sequence')

/* 개발용 task */
gulp.task('dev', ['install'], function(done) {
	runSequence(
		['clean'],
		'lint',
		'jst',
		'inject',
		'preprocess',
		'serve',
		done
	);
})