'use strict'

define(function (require) {
    // @ngInject
    return function FileService ($http, $q, env, HttpService) {

        var service = {}
        var _removeContentsFileUrl = env.host + 'remove/files'
        var _removeContentsFolderUrl = env.host + 'remove/folder'
        var _removeBgPageUrl = env.host + 'remove/bgimage'

        service.removeFiles = function (files) {
            var defer = $q.defer()
            HttpService.setService(_removeContentsFileUrl, files)
                .then(function (result) {
                    console.log('success')
                    defer.resolve(result)
                })
                .catch(function(error) {
                    console.error(error)
                    defer.resolve()
                })
            return defer.promise
        }

        service.removeFolder = function (folder) {
            var defer = $q.defer()
            HttpService.setService(_removeContentsFolderUrl, folder)
                .then(function (result) {
                    console.log('success')
                    defer.resolve(result)
                })
                .catch(function(error) {
                    console.error(error)
                    defer.resolve()
                })
            return defer.promise
        }

        service.removeBgImage = function (imageName) {
            var defer = $q.defer()
            HttpService.setService(_removeBgPageUrl, {
                name: imageName
            })
                .then(function (result) {
                    console.log('success')
                    defer.resolve(result)
                })
                .catch(function(error) {
                    console.error(error)
                    defer.resolve()
                })
            return defer.promise
        }

        return service

    }
})