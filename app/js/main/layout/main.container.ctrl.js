
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
                    $timeout(function () {
                        $rootScope.commandPerformer('thumbnailCapture', $rootScope.currentPageId)
                    }, 500)
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

            // zoom slider
            $scope.zoomSlider = 100 // default 값

            $scope.zoomBtnClick = function (target) {
                var newZoomValue

                if (target === 'window') {
                    // 창 사이즈에 zoom 맞춤
                    // TODO: 창 사이즈에 비례한 zoom value 만들기
                    newZoomValue = 300
                } else {
                    // 원본 사이즈로 나오게 zoom 맞춤 - 100% 로 하면 되고
                    newZoomValue = 100
                }

                $scope.zoomSlider = newZoomValue
            }

            $scope.$watch('zoomSlider', function (zoomValue) {
                // zoom 변동에 따른 실제 화면 적용 처리
                console.log(zoomValue)
                // add component 호출 - TODO: 각 컴포넌트에서 visual 로 zoomValue 를 곱해서 처리 해야함
                $rootScope.commandPerformer('changeZoom', (zoomValue / 100).toFixed(2))
            })
        }

        init()

    }

})