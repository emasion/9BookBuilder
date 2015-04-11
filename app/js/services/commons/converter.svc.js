'use strict'

define(function (require) {
    // @ngInject
    return function ConverterService ($http, $q, env, HttpService) {

        var service = {}
        var _ConverterPdfToImageUrl = env.host + 'converter/pdf'
        var _ConverterProgressUrl = env.host + 'converter/progress'

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

        service.converterProgress = function (fileId) {
            return HttpService.setService(_ConverterProgressUrl, {
                id: fileId
            })
        }

        return service

    }
})