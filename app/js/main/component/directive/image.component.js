
define(function (require) {

    'use strict'

    // @njInject
    return function ImageComponentDirective () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                options: '&getOptions',
                size: '&getSize'
            },
            templateUrl: '../../../../templates/component/image.html',
            controller: function ($rootScope, $scope, $element, $timeout, Component) {

                var component
                var getImagePath = function (src) {
                    if (_.isUndefined(src)) {
                        return 'images/bin_image.jpg'
                    }
                    if (src.indexOf('/') === -1) {
                        return 'public/contents/' + src
                    } else {
                        return src
                    }
                }

                var imageChangeHandler = function (event, params) {
                    if (params.id === $scope.id) {
                        if ($scope.imageSrc !== getImagePath(params.options.imageUrl)) {
                            $scope.imageSrc = getImagePath(params.options.imageUrl)
                        }
                    }
                }

                var init = function () {
                    $scope.compOptions = $scope.options({id: $scope.id})
                    $scope.size = $scope.size({id: $scope.id})
                    $scope.imageSrc = getImagePath($scope.compOptions.imageUrl)
                    $scope.notImageSrc = 'images/'
                    // instance 생성
                    $timeout(function () {
                        component = new Component($element, $scope.id, $scope.compOptions)
                    })
                }

                init()

                $rootScope.$on('changeProperty', imageChangeHandler)
            },
            link: function () {

            }
        }
    }

})