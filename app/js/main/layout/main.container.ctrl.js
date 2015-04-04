
define(function (require) {

    'use strict'

    // @njInject
    return function MainContainerController ($rootScope, $scope, ContentsService) {
        console.info('MainContainerController')

        var contentsChangeHandler = function (e, pageContents) {
            if (pageContents) {
                // server 에 현재 변경된 PAGE의 contents 를 저장한다.
                ContentsService.setContentsData($rootScope.currentPageId, pageContents).then(function () {
                    // 저장 후 처리
                    $rootScope.commandPerformer('changedPageContents', pageContents)
                })
            }
        }

        var init = function () {
            // 페이지 컨텐츠 정보가 변경될 때 발생
            $scope.$on('changePageContents', contentsChangeHandler)

            // add component select handler
            $scope.onAddContents = function (e) {
                console.log($(e.item).attr('data-value'))
                var componentType = $(e.item).attr('data-value')
                // add component 호출
                $rootScope.commandPerformer('addComponent', componentType)
            }
        }

        init()

    }

})