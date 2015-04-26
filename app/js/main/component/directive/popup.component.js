
define(function (require) {

    'use strict'

    // @njInject
    return function PopupComponentDirective () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
            },
            //templateUrl: '../../../../templates/component/text.html',
            controller: function ($scope, $element, $timeout, Component) {

                // TODO: kendo popup 을 이용한 Popup component directive 구현
            },
            link: function () {

            }
        }
    }

})