'use strict'

define(function (require) {
    // @ngInject
    return function ConverterService ($http, $q, env, HttpService) {

        var service = {}
        var _ConverterPdfToImageUrl = env.host + 'converter/pdf'

        service.pdfToImage = function (name) {
            var defer = $q.defer()
            HttpService.setService(_ConverterPdfToImageUrl, name)
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