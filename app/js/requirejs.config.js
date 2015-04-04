/*global require*/
'use strict';

require.config({
    baseUrl: './',
    shim: '@@<!--shim-->@@',
    paths: '@@<!--paths-->@@'
})

require([
    'angular',
    'app'
], function (angular, Application) {
    //Backbone.history.start()

    //window.DOMAIN = 'http://127.0.0.1:9000'
    // mobile check
    //window.MOBILE = theHelper().is.isMobile()

    Application.init()
})
