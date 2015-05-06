
define(function (require) {

    'use strict'

    var angular = require('angular')

    var ContainerSortableController = require('js/main/container/sortable.ctrl')
    var ContainerViewController = require('js/main/container/view.ctrl')
    var ContainerPropertyController = require('js/main/container/property.ctrl')

    var module = angular.module('app.main.container', [])
        .config(function ($stateProvider) {
            $stateProvider.state('main.container', {
                url: '/main',
                views: {
                    'container.sortable': {
                        controller: 'ContainerSortableController as containerSortableCtrl',
                        templateUrl: 'templates/container/sortable.html',
                        resolve: {
                            listItems: function (ContentsService, ConfigService) {
                                return ContentsService.getContentsData()
                            },
                            configData: function ($q, ConfigService) {
                                var defer = $q.defer()
                                var config = ConfigService.didGetConfig()
                                if (config) {
                                    defer.resolve(config)
                                } else {
                                    ConfigService.getConfigData().then(function (result) {
                                        defer.resolve(result)
                                    })
                                }
                                return defer.promise
                            }
                        }
                    },
                    'container.controlview': {
                        controller: 'ContainerViewController as containerViewCtrl',
                        templateUrl: 'templates/container/controlview.html'
                    },
                    'container.property': {
                        controller: 'ContainerPropertyController as containerPropertyCtrl',
                        templateUrl: 'templates/container/property.html',
                        resolve: {
                            configData: function ($q, ConfigService) {
                                var defer = $q.defer()
                                var config = ConfigService.didGetConfig()
                                if (config) {
                                    defer.resolve(config)
                                } else {
                                    ConfigService.getConfigData().then(function (result) {
                                        defer.resolve(result)
                                    })
                                }
                                return defer.promise
                            }
                        }
                    }
                }
            })
        })
        .controller('ContainerSortableController', ContainerSortableController)
        .controller('ContainerViewController', ContainerViewController)
        .controller('ContainerPropertyController', ContainerPropertyController)

    return module

})