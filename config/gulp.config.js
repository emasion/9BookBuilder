'use strict'

var pkg = require('../package.json')
var bower = require('bower')
var conf = require('../config/gulp.config')
var gulp = require('gulp')

global.SRC_DIR = 'app'
global.BUILD_DIR = 'dist'
global.TMP_DIR = '.tmp'
global.BOWER_DIR = bower.config.directory

var config = {
    version: pkg.version,
    port: {
        client_dev: 9001,
        client_dist: 9002,
        server_dev: 5000
    },
    paths: {
        src: {
            scripts: SRC_DIR + '/js/**/*.js',
            templates: SRC_DIR + '/templates/**/*.ejs',
            styles: SRC_DIR + '/styles/**/*.css',
            images: SRC_DIR + '/images/**/*.*',
            fonts: SRC_DIR + '/fonts/**/*.*',
            html: SRC_DIR + '/index.html',
            vendor: SRC_DIR + '/vendor/**/*.*',
            //lib: SRC_DIR + '/lib/**/*.*',
            tmp: SRC_DIR + '/.tmp',
            //requirejs: SRC_DIR + '/lib/requirejs/require.js',
        },
        public: {
            pages: SRC_DIR + '/public/pages/**/*.*',
            thumbs: SRC_DIR + '/public/thumbs/**/*.*',
        },
        dist: {
            scripts: BUILD_DIR + '/js',
            styles: BUILD_DIR + '/styles',
            images: BUILD_DIR + '/images',
            fonts: BUILD_DIR + '/fonts'
            //requirejs: BUILD_DIR + '/lib/requirejs',
        },
        tmp: {
            scripts: TMP_DIR + '/js/**/*.js',
            js: TMP_DIR + '/js/',
            styles: TMP_DIR + '/styles',
            html: TMP_DIR + '/index.html'
        }
    }
}

//console.info(config)
module.exports = config