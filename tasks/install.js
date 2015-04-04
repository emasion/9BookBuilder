/**
 * Created by emasion on 2014-11-15.
 */
// install task
// bower install 용도
'use strict'

var gulp = require('gulp')
var conf = require('../config/gulp.config')
var bower = require('bower')

/* bower installer */
gulp.task('install', function() {
	return bower.commands.install()
});
