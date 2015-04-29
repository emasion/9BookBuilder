
define([
    'angular',
    'js/services/commons/http.svc',
    'js/services/commons/contents.svc',
    'js/services/commons/contents.create.svc',
    'js/services/commons/config.svc',
    'js/services/commons/file.svc',
    'js/services/commons/converter.svc',
    'js/services/commons/popup.svc',
    'js/services/books/publish.svc',
], function (angular, HttpService, ContentsService, ContentsCreateService, ConfigService, FileService, ConverterService, PopupService, PublishService) {

    'use strict'

    var module = angular.module('app.service', [])
        .factory('HttpService', HttpService)
        .factory('ContentsService', ContentsService)
        .factory('ContentsCreateService', ContentsCreateService)
        .factory('ConfigService', ConfigService)
        .factory('FileService', FileService)
        .factory('ConverterService', ConverterService)
        .factory('PopupService', PopupService)
        .factory('PublishService', PublishService)

    return module

})