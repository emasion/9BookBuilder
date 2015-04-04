
define(function (require) {

    'use strict'

    var angular = require('angular')

    var componentFactory = require('js/main/component/component')
    var viewComponent = require('js/main/component/directive/view.component')
    var pageComponent = require('js/main/component/directive/page.component')
    var imageComponent = require('js/main/component/directive/image.component')
    var linkComponent = require('js/main/component/directive/link.component')
    var textComponent = require('js/main/component/directive/text.component')
    var videoComponent = require('js/main/component/directive/video.component')
    var fallbackSrc = require('js/main/component/directive/fallback.src')

    var module = angular.module('app.main.component', [])
        .factory('Component', componentFactory)
        .directive('viewComponent', viewComponent)
        .directive('pageComponent', pageComponent)
        .directive('imageComponent', imageComponent)
        .directive('linkComponent', linkComponent)
        .directive('textComponent', textComponent)
        .directive('videoComponent', videoComponent)
        .directive('fallbackSrc', fallbackSrc)
    return module

})