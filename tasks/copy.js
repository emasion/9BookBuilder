'use strict'

var gulp = require('gulp')
var conf = require('../config/gulp.config')
var uglify = require('gulp-uglify')
var saveLicense = require('uglify-save-license')

gulp.task('copy:requirejs', function() {
    return gulp.src(conf.paths.src.requirejs)
        .pipe(uglify({preserveComments: saveLicense}))
        .pipe(gulp.dest(conf.paths.dist.requirejs))
})

gulp.task('copy:fonts', function() {
    return gulp.src(conf.paths.src.fonts)
        .pipe(gulp.dest(conf.paths.dist.fonts))
})

gulp.task('copy:public', function() {
    return gulp.src(conf.paths.src.public)
        .pipe(gulp.dest(conf.paths.dist.public))
})

gulp.task('copy:msimages', function() {
    return gulp.src(conf.paths.src.msimages)
        .pipe(gulp.dest(conf.paths.dist.styles))
})