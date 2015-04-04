
define(function (require) {

    'use strict'

    var angular = require('angular')

    // module
    require('js/main/component/component.module')
    require('js/main/container/container.module')

    var MainMenuController = require('js/main/layout/main.menu.ctrl')
    var MainCopyrightController = require('js/main/layout/main.copyright.ctrl')
    var MainContainerController = require('js/main/layout/main.container.ctrl')
    var RootController = require('js/main/root.ctrl')

    var module = angular.module('app.main', [
        'app.main.component',
        'app.main.container'
    ])
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider.decorator('views', function (state, parent) {
                var result = {},
                    views = parent(state)
                angular.forEach(views, function (config, name) {
                    var autoName = name.replace('.', '/').replace('@', '')
                    if (autoName !== '') {
                        config.templateUrl = config.templateUrl || '/templates/' + autoName + '.html'
                    }
                    result[name] = config
                })
                return result
            })
            $stateProvider.state('main', {
                views: {
                    '': { controller: 'RootController as rootCtrl' },
                    'main.menu': { controller: 'MainMenuController as mainMenuCtrl' },
                    'main.container': { controller: 'MainContainerController as mainContainerCtrl' },
                    'main.copyright': { controller: 'MainCopyrightController as mainCopyrightCtrl' }
                }
            })
            $urlRouterProvider.otherwise('/main')
        })
        .controller('MainMenuController', MainMenuController)
        .controller('MainCopyrightController', MainCopyrightController)
        .controller('MainContainerController', MainContainerController)
        .controller('RootController', RootController)

    return module

})