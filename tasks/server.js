'use strict'

var gulp = require('gulp')
var conf = require('../config/gulp.config')
var browserSync = require('browser-sync')
var middleware = require('./proxy')
var nodemon = require('gulp-nodemon')

/* 변경 내용 감시 및 변경시 처리 task 지정 */
gulp.task('watch', function () {
	gulp.watch('app/js/**/*.js', [['lint', 'preprocess'], browserSync.reload])
	gulp.watch('app/js/templates/**/*.ejs', [['jst'], browserSync.reload])
	gulp.watch('app/index.html', [['inject'], browserSync.reload])
	gulp.watch('bower.json', ['inject'])
})

gulp.task('nodemon', function (cb) {
	return nodemon({
		script: 'server/app.js'
	}).on('start', function () {
		cb()
	})
})

function browserSyncInit(baseDir, files, browser, port) {
	browser = browser === undefined ? 'default' : browser;

	browserSync.instance = browserSync.init(files, {
		startPath: '/',
		notify: false,
		injectFileTypes: ["css", "png", "jpg", "jpeg", "svg", "gif", "webp"],
		server: {
			baseDir: baseDir,
			middleware: middleware
		},
		files: files,
		browser: browser,
		port: port
	})
}

/* serve 구동 - dev */
gulp.task('serve', ['nodemon', 'watch'], function() {
	browserSyncInit(
		['.tmp', 'app'],
		['.tmp/**/*.js', '.tmp/**/*.css', '.tmp/*.html'],
		'',
		conf.port.client_dev
	)
})

/* serve 구동 - dist */
gulp.task('serve:build', ['build'], function() {
	browserSyncInit(
		['dist'],
		null,
		'',
		conf.port.client_dist
	)
})

/* serve 구동 - dist */
gulp.task('serve:dist', function() {
	browserSyncInit(
		['dist'],
		null,
		'',
		conf.port.client_dist
	)
})



