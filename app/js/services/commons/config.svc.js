'use strict'

define(function (require) {
    // @ngInject
    return function ConfigService ($http, $q, env, HttpService) {

        var service = {}
        var _configUrl = env.host + 'config'

        service.getConfigData = function () {
            var defer = $q.defer()
            HttpService.getService(_configUrl)
                .then(function (data) {
                    defer.resolve(data.data)
                })
                .catch(function(error) {
                    console.error(error)
                })
            return defer.promise
        }

        return service

    }
})