'use strict'

var pkg = require('../package.json')
var bower = require('bower')
var conf = require('../config/gulp.config')
var gulp = require('gulp')

var config = {
    paths: {
        app: 'js/app',
        helper: 'js/utils/helper',
        angular: 'vendor/angularjs/angular',
        'angular-ui-router': 'vendor/angular-ui-router/release/angular-ui-router.min',
        textAngular: 'vendor/textAngular/dist/textAngular.min',
        'textAngular-rangy': 'vendor/textAngular/dist/textAngular-rangy.min',
        'textAngular-sanitize': 'vendor/textAngular/src/textAngular-sanitize',
        jquery: 'vendor/jquery/dist/jquery',
        //'jquery-ui': 'vendor/jquery-ui/jquery-ui.min',
        interface: 'lib/interface/interface',
        html2canvas: 'vendor/html2canvas/build/html2canvas',
        underscore: 'vendor/underscore/underscore-min',
        lodash: 'vendor/lodash/lodash.min',
        cssplugin: 'vendor/gsap/src/minified/plugins/CSSPlugin.min',
        easePack: 'vendor/gsap/src/minified/easing/EasePack.min',
        TweenLite: 'vendor/gsap/src/minified/TweenLite.min',
        'rangy-core': 'vendor/rangy/rangy-core.min',
        'rangy-cssclassapplier': 'vendor/rangy/rangy-cssclassapplier.min',
        'rangy-selectionsaverestore': 'vendor/rangy/rangy-selectionsaverestore.min',
        'rangy-serializer': 'vendor/rangy/rangy-serializer.min',
        videojs: 'vendor/video.js/dist/video-js/video.dev',
        templates: '.tmp/templates',
        // ngWidgets
        //ngxcore: 'lib/ngwidgets/ngxcore',
        //ngxbuttons: 'lib/ngwidgets/ngxbuttons',
        //ngxdata: 'lib/ngwidgets/ngxdata',
        //ngxmenu: 'lib/ngwidgets/ngxmenu',
        'kendo': 'lib/kendoui/kendo.all.min'
    },
    shim: {
        lodash: {
            exports: '_',
            deps: [ 'underscore' ]
        },
        //'jquery-ui': {
        //    deps: [ 'jquery' ]
        //},
        interface: [ 'jquery' ],
        angular: {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-ui-router': [
            'angular'
        ],
        'textAngular-sanitize': [
            'angular',
            'textAngular-rangy'
        ],
        textAngular: [
            'angular',
            'textAngular-rangy',
            'textAngular-sanitize',
            //'rangy-core',
            //'rangy-cssclassapplier',
            //'rangy-selectionsaverestore',
            //'rangy-serializer'
        ],
        // ngWidgets
        //'ngxbuttons': ['ngxcore'],
        //'ngxdata': ['ngxcore'],
        //'ngxmenu': ['ngxcore'],
        'kendo': {
            //exports: 'kendo',
            deps: ['jquery', 'angular']
        },
        TweenLite: {
            deps: ['easePack']
        },

        'app': {
            deps: [
                'angular',
                'angular-ui-router',
                'textAngular',
                'textAngular-rangy',
                'textAngular-sanitize',
                'jquery',
                //'jquery-ui',
                'interface',
                'html2canvas',
                'helper',
                'underscore',
                'lodash',
                'cssplugin',
                'easePack',
                'TweenLite',
                //'rangy-core',
                //'rangy-cssclassapplier',
                //'rangy-selectionsaverestore',
                //'rangy-serializer',
                //ngWidgets
                //'ngxcore',
                //'ngxbuttons',
                //'ngxdata',
                //'ngxmenu',
                'kendo',
                'videojs'
            ]
        }
    }
}

console.info(config)
module.exports = config