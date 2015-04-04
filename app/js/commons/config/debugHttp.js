'use strict'

define(function (require) {

    // @ngInject
    return function debugHttp ($provide, $httpProvider) {
        console.info('debugHttp')

        // register the interceptor as a service
        $provide.factory('debugHttpInterceptor', function ($log, $q, $timeout, $templateCache) {
            return {
                // optional method
                request: function (config) {
                    // $log.debug('debugHttp::request', config.url, config)
                    // do something on success
                    return config || $q.when(config)
                },
                // optional method
                requestError: function (rejection) {
                    // $log.error('debugHttp::requestError', rejection.url, rejection)
                    // do something on error
                    // if(canRecover(rejection)) {
                    //   return responseOrNewPromise
                    // }
                    return $q.reject(rejection)
                },
                // optional method
                response: function (response) {
                    // $log.debug('debugHttp::response', response.config.url, response)
                    // do something on success
                    if(!response || $templateCache.get(response.config.url)) { return response }
                    return $timeout(function () {
                        return response || $q.when(response)
                    }, Math.random() * 200 + 200)
                    // return response || $q.when(response)
                },
                // optional method
                responseError: function (rejection) {
                    $log.error('debugHttp::responseError', rejection.config.url, rejection)
                    // do something on error
                    // if(canRecover(rejection)) {
                    //   return responseOrNewPromise
                    // }
                    return $timeout(function () {
                        return $q.reject(rejection)
                    }, Math.random() * 200 + 200)
                    // return $q.reject(rejection)
                }
            }
        })
        $httpProvider.interceptors.push('debugHttpInterceptor')
    }
})