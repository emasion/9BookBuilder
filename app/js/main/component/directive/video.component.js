
define(function (require) {

    'use strict'

    // @njInject
    return function VideoComponentDirective () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',
                options: '&getOptions',
                size: '&getSize'
            },
            templateUrl: '../../../../templates/component/video.html',
            controller: function ($rootScope, $scope, $element, $timeout, Component) {

                var component
                var getVideoPath = function (src) {
                    if (_.isUndefined(src)) {
                        return ''
                    }
                    if (src.indexOf('/') === -1) {
                        return 'public/contents/' + src
                    } else {
                        return src
                    }
                }

                var imageChangeHandler = function (event, params) {
                    if (params.id === $scope.id) {
                        if ($scope.posterUrl !== getVideoPath(params.options.posterUrl)) {
                            $scope.posterUrl = getVideoPath(params.options.posterUrl)
                        }
                    }
                }

                var init = function () {
                    $scope.compOptions = $scope.options({id: $scope.id})
                    $scope.size = $scope.size({id: $scope.id})
                    // video src 설정
                    //$scope.videoSrc = getVideoPath($scope.compOptions.videoUrl)
                    $scope.posterUrl = getVideoPath($scope.compOptions.posterUrl)

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