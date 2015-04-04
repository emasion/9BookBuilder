
define(function (require) {

    'use strict'

    // @njInject
    return function ContainerPropertyController ($scope, $rootScope, $timeout, env, configData, ContentsService) {
        console.info('ContainerPropertyController')

        var $ = angular.element
        var selectedComponent = false
        var propertyPanelBar = $('#propertyPanelBar')
        var getPropertyTemplateUrl = function (type) {
            var baseUrl = 'templates/property/property.'
            if (type !== 'layout') {
                baseUrl = baseUrl + 'attr.'
            }
            return baseUrl + type + '.html'
        }

        var IMAGE_UPLOAD_FORMAT = ['.jpg', '.JPG', '.png', '.PNG', '.gif', '.GIF']
        var VIDEO_UPLOAD_FORMAT = ['.mp4', '.MP4', '.webm', '.WebM', '.wmv', '.WMV', '.avi', '.AVI', '.flv', '.FLV', '.mkv', '.MKV']

        $scope.componentProperty
        $scope.minSize = {
            x: 0,
            y: 0,
            width: configData.layout.component.minWidth,
            height: configData.layout.component.minHeight
        }
        $scope.maxSize = {
            x: configData.layout.width,
            y: configData.layout.height,
            width: configData.layout.component.maxWidth,
            height: configData.layout.component.maxHeight
        }
        $scope.activeProperty = [
            getPropertyTemplateUrl('layout')
        ]
        $scope.propertyFormOptions = {
            animation: false,
            contentUrls: $scope.activeProperty,
            contentLoad: function (e) {
                //this.expand($('[id^="item"]'))
            }
        }

        var getImageHtml = function (property) {
            // TODO: contentsPath 로 차후에 서버에서 받아서 클라이언트에서 가지고 있다가 제공하게 변경 예정
            var contentsPath = 'public/contents/'
            return '<img ng-src="' + contentsPath + '{{componentProperty.options.' + property + '}}" style="max-width: 200px; max-height: 200px;" />'
        }

        // image & tooltip contents
        $scope.imagePreview = getImageHtml('imageUrl')
        $scope.imageHoverPreview = getImageHtml('imageUrlHover')
        $scope.posterImagePreview = getImageHtml('posterUrl')

        // upload property
        $scope.uploadUrl = env.host + 'upload/image'
        $scope.uploadVideoUrl = env.host + 'upload/video'
        $scope.deleteFilesUrl = env.host + 'remove/files'
        $scope.deleteFolderUrl = env.host + 'remove/folder'

        $rootScope.ingUpload
        $scope.imageUploadType

        $scope.uploaderLocale = {
            select: '업로드',
            done: '',
            statusUploaded: ''
        }

        // upload 할 이미지 선택시 event
        $scope.onSelect = function (e) {
            var selectOk = true
            _.forEach(e.files, function (value) {
                if (!_.findWhere(IMAGE_UPLOAD_FORMAT, value.extension)) {
                    e.preventDefault()
                    alert('이미지 파일만 업로드 할 수 있습니다.')
                    selectOk = false
                }
            })
            if (selectOk) {
                $rootScope.ingUpload = true
                //$scope.$apply()
            }
        }

        // upload 시작시에
        $scope.onUpload = function (e) {
            console.log('[upload]', e)
            $scope.imageUploadType = e.sender.element.attr('image-type')
        }

        // progress
        $scope.onProgress = function (e) {
            //console.log('****** upload :', e.percentComplete)
            $rootScope.uploadProgressModal(e.percentComplete, e.files[0].name)
            $scope.$apply()
        }

        // upload 성공시
        $scope.onSuccess = function (e) {
            console.log('[success upload image]', e)
            var response = e.response

            var fileName = response.data.name
            var imageType = $scope.imageUploadType

            // 기존 등록되 있는 이미지를 삭제 요청한다.
            $rootScope.requestRemoveContentsFiles([$scope.componentProperty.options[imageType]], function (result) {
                console.log('[success remove image]', result)
            })

            // 현재 선택된 컴포넌트 이미지를 교체한다.
            $scope.componentProperty.options[imageType] = fileName
            $scope.$digest()
        }

        // image upload 완료시
        $scope.onComplete = function (e) {
            console.log(e)
            $rootScope.ingUpload = false
            $rootScope.uploadProgressModal(-1)
            $scope.imageUploadType = undefined
            $scope.$apply()
        }

        // upload 할 이미지 선택시 event
        $scope.onSelectVideo = function (e) {
            var selectOk = true
            _.forEach(e.files, function (value) {
                if (!_.findWhere(VIDEO_UPLOAD_FORMAT, value.extension)) {
                    e.preventDefault()
                    alert('비디오 파일만 업로드 할 수 있습니다.')
                    selectOk = false
                }
            })
            if (selectOk) {
                $rootScope.ingUpload = true
                $scope.$apply()
            }
        }

        // upload 성공시
        $scope.onSuccessVideo = function (e) {
            console.log('[success upload video]', e)
            var response = e.response
            var fileName = response.data.name

            // 기존 등록되 있는 video 를 삭제 요청한다.
            $rootScope.requestRemoveContentsFiles([$scope.componentProperty.options.videoUrl], function (result) {
                console.log('[success remove video]', result)
            })

            // 현재 선택된 컴포넌트 video 를 교체한다.
            $scope.componentProperty.options.videoUrl = fileName
            $scope.$digest()
        }

        // video player
        var player
        $scope.previewVideo = function (videoUrl) {
            var contentsPath = 'public/contents/'
            var attrs = {}
            attrs.id = 'videoPreviewPlayer'
            attrs.type = 'video/mp4'
            var setup = {
                'techOrder' : ['html5', 'flash'],
                'controls' : true,
                'preload' : 'auto',
                'autoplay' : true,
                'height' : 480,
                'width' : 854
            }
            var videoUrl = contentsPath + videoUrl

            function readyHandler () {
                var source =([
                    { type: 'video/mp4', src: videoUrl }
                ])
                this.src(source)
            }

            function appendVideoEl (id) {
                var videoEl = $('<video/>').attr('id', id).addClass('video-js vjs-sublime-skin vjs-controls-enabled vjs-has-started vjs-paused vjs-user-inactive')
                $('#videoContainer').append(videoEl)
            }

            videojs.options.flash.swf = contentsPath + 'video-js.swf'
            appendVideoEl(attrs.id)
            player = videojs(attrs.id, setup, readyHandler)

            $scope.previewVideoPopup.open().center()
        }

        $scope.previewVideoClose = function () {
            if (player) {
                player.dispose()
            }
        }

        // component 를 선택했을 때 처리
        var selectComponentHandler = function (e, id) {
            selectedComponent = false

            var panelBar = propertyPanelBar.data('kendoPanelBar')

            function removeAttributePanel () {

                if (propertyPanelBar.children('li').length > 1) {
                    panelBar.remove(propertyPanelBar.children('li')[1])
                }
            }

            function appendAttributePanel (type) {
                panelBar.append([{
                    text: 'Attribute',
                    contentUrl: getPropertyTemplateUrl(type)
                }])
                $timeout(function () {
                    $scope.$apply()
                    panelBar.expand(propertyPanelBar.children('li')[1])
                })
            }

            ContentsService.getContentsData($rootScope.currentPageId).then(function (contents) {
                var selectComponentData = _.findWhere(contents.items, {id: id})
                // 일치하는 item 이 있을 때
                if (selectComponentData) {
                    if (_.isUndefined($scope.componentProperty) || $scope.componentProperty.type !== selectComponentData.type) {
                        removeAttributePanel()
                        appendAttributePanel(selectComponentData.type)
                    }
                    $scope.componentProperty = selectComponentData
                    $timeout(function () {
                        selectedComponent = true
                    })
                }
                // 없으면 초기화
                else {
                    removeAttributePanel()
                    $scope.componentProperty = undefined
                    $timeout(function () {
                        selectedComponent = false
                    })
                }

            })

        }

        // component 의 data 가 외부에서 변경되었을 때 처리
        var componentChangeHandler = function (e, componentData) {
            if (componentData) {
                selectedComponent = false
                if ($scope.componentProperty.id === componentData.id) {
                    $scope.componentProperty = _.merge($scope.componentProperty, componentData)
                } else {
                    //$scope.componentProperty = componentData
                }
                $timeout(function () {
                    selectedComponent = true
                })
            }
        }

        var changePropertyValue = function (newValue, oldValue) {
            // 선택된 component 가 있을 때
            if (selectedComponent && !_.isEqual(newValue, oldValue)) {
                console.log('changePropertyValue', newValue)

                $rootScope.commandPerformer('changeProperty', newValue)
            }
        }

        var init = function () {
            // component 가 마우스로 선탹되었을 때 발생
            $scope.$on('selectComponent', _.bind(selectComponentHandler, this))
            // 페이지 컨텐츠 정보가 변경될 때 발생
            $scope.$on('changeComponent', _.bind(componentChangeHandler, this))
            // input 데이터 변경될 때 - 변경내용 component 저장해야함
            $scope.$watch('componentProperty', changePropertyValue, true)
        }

        init()

    }

})