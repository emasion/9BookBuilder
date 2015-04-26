
define(function (require) {

    'use strict'

    // @njInject
    return function MainContainerController ($rootScope, $scope, $timeout, format, ContentsService, ConfigService, configLayoutData) {
        console.info('MainContainerController')
        var $ = angular.element
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
            $scope.zoomSlider = configLayoutData.zoomDefault // default 값
            $scope.zoom = {
                min: configLayoutData.zoomMin,
                max: configLayoutData.zoomMax
            }

            $scope.zoomBtnClick = function (target) {
                var newZoomValue

                if (target === 'window') {
                    // 창 사이즈에 zoom 맞춤
                    // TODO: 창 사이즈에 비례한 zoom value 만들기
                    //newZoomValue = 150

                    var bookSizeRadio = 0.95
                    var boxWidth = $('.view-pattern').width()
                    var boxHeight = $('.view-pattern').height()
                    var pageWidth = $('#pageComponent').width()
                    var pageHeight = $('#pageComponent').height()
                    var width, height

                    //book 너비 높이가 모두 컨테이너 너비 높이보다 작은 경우
                    if (boxWidth > pageWidth && boxHeight > pageHeight) {
                        if ((boxWidth - pageWidth) / 2 > (boxHeight - pageHeight) / 2) {
                            //세로가 좁다 - 세로에 sizeRatio적용
                            //console.log('세로가 좁다 - 세로에 sizeRatio적용')
                            height = boxHeight * bookSizeRadio
                            width = (height * pageWidth) / pageHeight
                        } else {
                            //가로가 좁다 - 가로에 sizeRatio적용
                            //console.log('가로가 좁다 - 가로에 sizeRatio적용')
                            width = boxWidth * bookSizeRadio
                            height = (width * boxHeight) / boxWidth
                        }
                    } else {
                        var nTempWidth = boxWidth / pageWidth
                        var nTempHeight = boxHeight / pageHeight

                        //너비 ,높이 비율값 가운데 큰 값이 기준
                        if (nTempWidth > nTempHeight) {
                            //기준값을 높이로
                            //console.log('기준값을 높이로')
                            height = boxHeight * bookSizeRadio
                            width = (height * pageWidth) / pageHeight
                            if (width > boxWidth * bookSizeRadio) { //넘어가면
                                width = boxWidth * bookSizeRadio
                                height = (width * pageHeight) / pageWidth
                            }
                        } else {
                            //기준값을 너비로
                            //console.log('기준값을 너비로')
                            width = boxWidth * bookSizeRadio
                            height = (width * pageHeight) / pageWidth;
                            if (height > boxHeight * bookSizeRadio) { //넘어가면
                                height = boxHeight * bookSizeRadio
                                width = (height * pageWidth) / pageHeight
                            }
                        }
                    }

                    // 비율 구하기
                    newZoomValue = parseInt(width / pageWidth * 100)

                    console.log(width, height, newZoomValue)
                } else {
                    // 원본 사이즈로 나오게 zoom 맞춤 - 100% 로 하면 되고
                    newZoomValue = 100
                }

                $scope.zoomSlider = newZoomValue
                $timeout(function () {
                    $scope.$apply()
                })
                //$rootScope.commandPerformer('changeZoom', (newZoomValue / 100).toFixed(2))
            }

            $scope.mainContainerResize = function (event) {
                $rootScope.zoomBoxPositionChange()
            }

            $scope.$watch('zoomSlider', function (zoomValue) {
                // zoom 변동에 따른 실제 화면 적용 처리
                console.log(zoomValue)
                // add component 호출
                $rootScope.commandPerformer('changeZoom', (zoomValue / 100).toFixed(2))
            })

            var resizeHandler = function () {
                // zoom value 조절
                $scope.zoomBtnClick('window')
                // control-zoom-menu right 위치값 변경
                $rootScope.zoomBoxPositionChange()
            }

            $(window).on('resize', _.debounce(resizeHandler, 200))
            _.delay(function () {
                resizeHandler()
            }, 500)
        }

        init()

    }

})