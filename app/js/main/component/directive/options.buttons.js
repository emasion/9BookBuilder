
define(function (require) {

    'use strict'

    // @njInject
    return function OptionButtonsDirective () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: '../../../../templates/component/options.html',
            controller: function ($rootScope, $scope, $element, $timeout, Component) {

            },
            link: function (scope, iElement, iAttrs) {

            }
        }
    }

})