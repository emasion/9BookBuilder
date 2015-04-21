'use strict'

define(function (require) {
    // @ngInject
    return function PublishService ($http, $q, env, HttpService) {

        var service = {}
        var _publishUrl = env.host + 'publish'

        service.publish = function (type, bookName, thumbnailData, bookConfig) {
            var defer = $q.defer()
            HttpService.setService(_publishUrl, {
                type: type,
                bookName: bookName,
                thumbnail: thumbnailData,
                bookConfig: bookConfig || {}
            }).then(function (data) {
                defer.resolve(data)
                //window.alert(data.tempPath)
            })
            .catch(function(error) {
                console.error(error)
            })
            return defer.promise
        }

        return service

    }
})