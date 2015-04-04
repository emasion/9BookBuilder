'use strict'

define(function (require) {

    // @ngInject
    return function sessionRecover ($provide, $httpProvider) {
        $provide.factory('sessionRecover', function ($log, $q, $injector) {
            var $http, loginModal
            var failedRequests = []

            var processLogin = function processLogin (response) {
                var d = $q.defer()

                failedRequests.push({
                    config: response.config,
                    deferred: d
                })

                $http = $http || $injector.get('$http')
                loginModal = loginModal || $injector.get('loginModal')

                var retry = function () {
                    _.each(failedRequests, function (request) {
                        $http(request.config).then(function (d) {
                            return function (response) {
                                d.resolve(response)
                            }
                        }(request.deferred))
                    })
                    failedRequests = []
                }

                loginModal.login()
                    .then(function (response) {
                        console.info('retry', failedRequests)
                        retry()
                    })

                return d.promise
            }

            return {
                response: function (response) {
                    if(response.data &&
                        response.data.serviceMessage !== 'fail.session.invalidate') {
                        return response
                    }

                    return processLogin(response)
                },
                responseError: function (rejection) {
                    if(rejection.status === 401) {
                        return processLogin(rejection)
                    }
                    return $q.reject(rejection)
                }
            }
        })

        $httpProvider.interceptors.push('sessionRecover')
    }
})