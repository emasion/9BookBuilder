
define(function (require) {

    'use strict'

    // @njInject
    return function ViewComponentDirective ($compile) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                pageContents: '=',
                pageNumber: '=',
                pageImage: '=?'
            },
            templateUrl: '../../../../templates/component/view.html',
            controller: function ($rootScope, $scope) {

                var changeComponentHandler = function (e, params) {
                    if (_.isUndefined(params.id)) {
                        return
                    }
                    if (params) {
                        var findIndex = _.findIndex($scope.pageContents, {id: params.id})
                        $scope.pageContents[findIndex] = _.extend($scope.pageContents[findIndex], params)
                        $rootScope.commandPerformer('changePageContents', $scope.pageContents)
                    }
                }

                var init = function () {
                    // 선택된 컴포넌트 정보가 변경되었을 때 발생
                    $scope.$on('changeComponent', _.bind(changeComponentHandler, this))
                    $scope.$on('changeProperty', _.bind(changeComponentHandler, this))
                }

                init()
            },
            link: function (scope) {

            }
        }
    }

})