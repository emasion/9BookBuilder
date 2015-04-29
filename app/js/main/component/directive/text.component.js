
define(function (require) {

    'use strict'

    // @ngInject
    return function TextComponentDirective () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                options: '&getOptions',
                size: '&getSize'
            },
            templateUrl: '../../../../templates/component/text.html',
            controller: function ($scope, $element, $timeout, Component) {

                var component
                var init = function () {
                    $scope.compOptions = $scope.options({id: $scope.id})
                    $scope.size = $scope.size({id: $scope.id})

                    $scope.textBgColor = $scope.compOptions.bgColor
                    $scope.fontColor = $scope.compOptions.fontColor
                    $scope.textOpacity = $scope.compOptions.opacity

                    // instance 생성
                    $timeout(function () {
                        component = new Component($element, $scope.id, $scope.compOptions)
                    })
                }

                init()
            },
            link: function () {

            }
        }
    }

})