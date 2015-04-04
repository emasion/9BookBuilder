
define(function (require) {

    'use strict'

    // @njInject
    return function LinkComponentDirective () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                options: '&getOptions',
                size: '&getSize'
            },
            templateUrl: '../../../../templates/component/link.html',
            controller: function ($scope, $element, $timeout, Component) {

                var component
                var init = function () {
                    $scope.compOptions = $scope.options({id: $scope.id})
                    $scope.size = $scope.size({id: $scope.id})

                    $scope.linkBgColor = $scope.compOptions.bgColor
                    $scope.linkOpacity = $scope.compOptions.opacity

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