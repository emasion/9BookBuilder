/**
 * Created by emasion on 2014-11-15.
 */
'use strict'

var gulp = require('gulp')
var conf = require('../config/gulp.config')
var rconf = require('../config/requirejs.config')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var preprocess = require('gulp-preprocess')
var jstConcat = require('gulp-jst-concat')
var insert = require('gulp-insert')
var slash = require('gulp-slash')
var amdOptimize = require('amd-optimize')
var size = require('gulp-size')
var replace = require('gulp-replace')
var filesize = require('gulp-filesize')

// ejs -> templates.js 로 merge 하는 역활
gulp.task('jst', function() {
	return gulp.src(conf.paths.src.templates)
		.pipe(slash())
		.pipe(jstConcat('templates.js', {
			renameKeys: ['^.*9Book/(.*.ejs)$', '$1']
		}))
		.pipe(insert.prepend('define(function(){\n'))
		.pipe(insert.append('return this["JST"];});'))
		.pipe(gulp.dest(conf.paths.src.tmp))
		.pipe(size({ title: 'jst' }))
})

gulp.task('preprocess', function() {
	return gulp.src(conf.paths.src.scripts)
		.pipe(preprocess())
		.pipe(replace('\'@@<!--paths-->@@\'', JSON.stringify(rconf.paths).replace(/\"/g, "'")))
		.pipe(replace('\'@@<!--shim-->@@\'', JSON.stringify(rconf.shim).replace(/\"/g, "'")))
		.pipe(gulp.dest(conf.paths.tmp.js))
})

gulp.task('optimize', ['jst'], function() {
	return gulp.src(conf.paths.src.scripts)
		//.pipe(preprocess())
		.pipe(replace('\'@@<!--paths-->@@\'', JSON.stringify(rconf.paths).replace(/\"/g, "'")))
		.pipe(replace('\'@@<!--shim-->@@\'', JSON.stringify(rconf.shim).replace(/\"/g, "'")))
		.pipe(amdOptimize('scripts/main', {
			baseUrl: 'app',
			output: 'main.src.js',
			paths: rconf.paths,
			shim: rconf.shim
		}))
		.pipe(concat('main.js'))
		//.pipe(uglify({preserveComments: saveLicense}))
		.pipe(filesize())
		.pipe(gulp.dest(conf.paths.dist.scripts))
		.pipe(size({ title: 'optimize' }))
})
