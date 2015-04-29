
define(function (require) {
    'use strict'

    var angular = require('angular')

    var GnPopupDirective = require('js/main/popup/gnpopup/gnpopup.dtv')
    var GnPopupController = require('js/main/popup/gnpopup/gnpopup.ctrl')

    var module = angular.module('app.main.popup', [])
        .controller('GnPopupController', GnPopupController)
        .directive('gnPopup', GnPopupDirective)
    return module
})
