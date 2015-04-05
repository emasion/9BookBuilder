'use strict'

define(function(require) {

    var angular = require('angular')
    var theHelper = require('helper')

    // module
    require('js/services/service.module')
    require('js/main/main.module')

    // constant
    var env = require('js/commons/constant/env')
    var format = require('js/commons/constant/format')
    var upload = require('js/commons/constant/upload')

    // config
    var debugHttp = require('js/commons/config/debugHttp')
    var exceptionHandler = require('js/commons/config/exceptionHandler')
    var sessionRecover = require('js/commons/config/sessionRecover')

    // run
    var debugState = require('js/commons/run/debugState')

    var module = angular.module('app', [
        'ui.router',
        'textAngular',
        'app.service',
        'app.main',
        'kendo.directives',
    ])
        .constant('env', env)
        .constant('format', format)
        .constant('upload', upload)
        .config(debugHttp)
        .config(exceptionHandler)
        .config(sessionRecover)
        .factory('theHelper', theHelper)
        .run(debugState)
        .run(function (ConfigService, theHelper, $state) {
            ConfigService.getConfigData().then(function (result) {
                // debugger mode
                if (result) {
                    theHelper.debugger.debuggerModeOn(result.debuggerUse)
                }

                // next state...
                //$state.go('main')
            })
        })

    module.init = function () {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['app'])
        })
    }

    return module
})
