
define(function (require) {

    'use strict'

    // @njInject
    return function MainContainerController ($rootScope, $scope, $timeout, format, ContentsService) {
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

        // select bg image 선택
        var selectBgImage = function () {
            $rootScope.uploadSelectFile('bgImage', $scope.uploadCallback)
        }

        var performerBgImage = function (imageName) {
            $rootScope.commandPerformer('changeBgImage', imageName)
        }

        var viewContextMenuSelectHandler = function (command) {
            switch (command) {
                case 'changeBgImage':
                    selectBgImage()
                    break
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

            // view page context menu open event handler
            $scope.onOpenContextMenu = function (e) {
                if (_.isUndefined($rootScope.currentPageId)) {
                    e.preventDefault()
                    return false
                }
            }

            // view page context menu handler
            $scope.onViewContextMenu = function (e) {
                console.log($(e.item).attr('data-value'))
                viewContextMenuSelectHandler($(e.item).attr('data-value'))
            }

            // view bg image upload callback
            $scope.uploadCallback = {
                onSelect: function (e) {},
                onUpload: function (e) {},
                onProgress: function (e) {},
                onSuccess: function (e) {
                    var response = e.response
                    var fileName = response.data.name
                    // upload 한 image 로 page 교체해준다.
                    performerBgImage(fileName)
                },
                onComplete: function (e) {}
            }
        }

        init()

    }

})