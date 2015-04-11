'use strict'

define(function (require) {
    // @ngInject
    return function HttpService ($http, $q) {

        var service = {}
        var _cacheData = []

        service.getService = function (url, params) {
            var defer = $q.defer()

            if (_cacheData[url]) {
                defer.resolve(_cacheData[url])
            } else {
                $http.defaults.useXDomain = true
                /*$http.get(url)
                    .then(function(data) {
                        _cacheData[url] = data
                        defer.resolve(data)
                    })
                    .catch(function(error) {
                        console.error(error)
                    })*/
                $http({
                    url: url,
                    method: 'GET',
                    params: params
                }).then(function (data, status, headers, config) {
                    _cacheData[url] = data
                    defer.resolve(data)
                }).catch(function (err) {
                    console.error(err)
                })
            }
            return defer.promise
        }

        service.setService = function (url, data, config) {
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

            return defer.promise
        }

        return service

    }
})