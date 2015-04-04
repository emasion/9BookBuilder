'use strict'

define(function (require) {
    // @ngInject
    return function HttpService ($http, $q) {

        var service = {}
        var _cacheData = []

        service.getService = function (url) {
            var defer = $q.defer()

            if (_cacheData[url]) {
                defer.resolve(_cacheData[url])
            } else {
                $http.defaults.useXDomain = true
                $http.get(url)
                    .then(function(data) {
                        _cacheData[url] = data
                        defer.resolve(data)
                    })
                    .catch(function(error) {
                        console.error(error)
                    })
            }
            return defer.promise
        }

        service.setService = function (url, data, config) {
            //TODO: Server 에서 처리해야 함
            var defer = $q.defer()

            $http.defaults.useXDomain = true
            $http({
                url: url,
                method: 'POST',
                data: data
            })
                .then(function(result) {
                    defer.resolve(result)
                })
                .catch(function(error) {
                    console.error(error)
                })

            /*$http.put(url, data, config)
                .then(function(result) {
                    defer.resolve(result)
                })
                .catch(function(error) {
                    console.error(error)
                })*/

            return defer.promise
        }

        return service

    }
})