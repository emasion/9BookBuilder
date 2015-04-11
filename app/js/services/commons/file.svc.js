'use strict'

define(function (require) {
    // @ngInject
    return function FileService ($http, $q, env, HttpService) {

        var service = {}
        var _removeContentsFileUrl = env.host + 'remove/files'
        var _removeContentsFolderUrl = env.host + 'remove/folder'
        var _removeBgPageUrl = env.host + 'remove/bgimages'
        var _saveThumbnailImagesUrl = env.host + 'save/thumbnail'

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

        service.removeBgImages = function (imageNameArr) {
            var defer = $q.defer()
            HttpService.setService(_removeBgPageUrl, imageNameArr)
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

        service.saveThumbnailImages = function (imagesData) {
            return HttpService.setService(_saveThumbnailImagesUrl, imagesData)
        }

        return service

    }
})