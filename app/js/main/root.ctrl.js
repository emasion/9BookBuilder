
define(function (require) {

    'use strict'

    // @njInject
    return function RootController ($rootScope, $scope, $timeout, $compile, env, format, upload, FileService, PublishService, ContentsService) {
        console.info('RootController')

        var $ = angular.element

        $rootScope.currentPageId
        $rootScope.selectComponent
        $rootScope.thumbnailBase64Data = {}

        $rootScope.linkHandler = function (linkUrl) {
            console.log(linkUrl)
        }

        // 전역으로 실행시킬 커맨드 여기 등록
        $rootScope.commandPerformer = function (command, params) {
            if (command === 'currentPageChange') {
                $rootScope.currentPageId = params
            }
            if (command === 'selectComponent') {
                $rootScope.selectComponent = params
            }
            if (command === 'thumbnailImageUpdate') {
                $rootScope.thumbnailBase64Data[params.id] = params.imgBase64
                //console.log('[thumbnailBase64Data]', $rootScope.thumbnailBase64Data)
            }
            if (command === 'previewBook' || command === 'publishBook') {
                $scope.publishHandler(command)
            }
            $rootScope.$broadcast(command, params)
        }

        // CONTENTS FILES 삭제 요청
        $rootScope.requestRemoveContentsFiles = function (files, callback) {
            if (_.isUndefined(files) || files.length < 1) {
                return
            }
            FileService.removeFiles(files).then(function (result) {
                if (callback && _.isFunction(callback)) {
                    callback(result)
                }
            })
        }

        // CONTENTS FOLDER 삭제 요청
        $rootScope.requestRemoveContentsFolder = function (folder, callback) {
            if (_.isUndefined(folder)) {
                return
            }
            FileService.removeFolder(folder).then(function (result) {
                if (callback && _.isFunction(callback)) {
                    callback(result)
                }
            })
        }

        // upload select file
        $rootScope.uploadSelectFile = function (type, callback) {
            var uploader = $('#globalUploader')
            uploader.children().off().remove()
            var uploadInput = $('<input kendo-upload />').attr({
                'name':"{{ uploadNameGlobal }}",
                'type':"file",
                'k-localization':"uploaderLocaleGlobal",
                'k-async':"{ saveUrl: uploadUrlGlobal, autoUpload: true }",
                'k-multiple':"{{ uploadMultipleGlobal }}",
                'k-showfilelist':"{{ uploadShowFileListGlobal }}",
                'k-select':"onSelectGlobal",
                'k-upload':"onUploadGlobal",
                'k-progress':"onProgressGlobal",
                'k-success':"onSuccessGlobal",
                'k-complete':"onCompleteGlobal"
            })
            var uploadTypeConstant = upload[type]
            if (_.isUndefined(uploadTypeConstant)) {
                return
            }

            // setting
            $rootScope.uploadNameGlobal = uploadTypeConstant.uploadName
            $rootScope.uploaderLocaleGlobal = uploadTypeConstant.uploaderLocale
            $rootScope.uploadUrlGlobal = env.host + uploadTypeConstant.uploadUrl
            $rootScope.uploadMultipleGlobal = uploadTypeConstant.uploadMultiple
            $rootScope.uploadShowFileListGlobal = uploadTypeConstant.uploadShowFileList
            var fileFormat = format.upload[uploadTypeConstant.format]
            var formatNotMatchMsg = uploadTypeConstant.formatNotMatchMsg

            // upload file selected event
            $rootScope.onSelectGlobal = function (e) {
                console.log('[select upload files]', e)
                var selectOk = true
                _.forEach(e.files, function (value) {
                    if (!_.findWhere(fileFormat, value.extension)) {
                        e.preventDefault()
                        alert(formatNotMatchMsg)
                        selectOk = false
                    }
                })
                if (selectOk) {
                    $rootScope.ingUpload = true
                }
                // callback 등록되 있으면 call
                if (callback.onSelect && _.isFunction(callback.onSelect)) {
                    callback.onSelect(e)
                }
            }

            // upload start
            $rootScope.onUploadGlobal = function (e) {
                console.log('[start upload files]', e)
                // callback 등록되 있으면 call
                if (callback.onUpload && _.isFunction(callback.onUpload)) {
                    callback.onUpload(e)
                }
            }

            // upload progress
            $rootScope.onProgressGlobal = function (e) {
                console.log('[progress upload files]', e.percentComplete)
                $rootScope.uploadProgressModal(e.percentComplete, e.files[0].name)
                //$scope.$apply()
                // callback 등록되 있으면 call
                if (callback.onProgress && _.isFunction(callback.onProgress)) {
                    callback.onProgress(e)
                }
            }

            // upload success
            $rootScope.onSuccessGlobal = function (e) {
                console.log('[success upload files]', e)
                // callback 등록되 있으면 call
                if (callback.onSuccess && _.isFunction(callback.onSuccess)) {
                    callback.onSuccess(e)
                }
            }

            // upload onComplete
            $rootScope.onCompleteGlobal = function (e) {
                console.log('[complete upload files]', e)
                $rootScope.ingUpload = false
                $rootScope.uploadProgressModal(-1)
                $scope.$apply()

                uploadInput.data('kendoUpload').destroy()

                // callback 등록되 있으면 call
                if (callback.onComplete && _.isFunction(callback.onComplete)) {
                    callback.onComplete(e)
                }
            }

            // append upload input
            uploader.append(uploadInput)
            $compile(uploadInput)($rootScope)

            $timeout(function () {
                // btn 호출
                uploader.find('input[type=file]').trigger('click')
            })
        }

        // progress popup
        $scope.openPopup = false
        $scope.uploadStatus
        $scope.uploadProgress = 0
        $scope.progressBar
        $rootScope.uploadProgressModal = function (percent, fileName) {
            function progressManualHandler (value) {
                if ($scope.progressBar) {
                    var progressBarEl = $scope.progressBar.element
                    if (progressBarEl.find('.k-state-selected').length < 1) {
                        var selectedTag = $('<div/>').addClass('k-state-selected')
                        selectedTag.append(progressBarEl.find('.k-progress-status-wrap'))
                        progressBarEl.append(selectedTag)
                    }
                    $scope.progressBar.element.find('.k-state-selected').css({ width: value + '%'})
                    $scope.progressBar.element.find('.k-progress-status').text(value + '%')
                }
            }
            $scope.uploadStatus = fileName || 'upload file'
            if (!$scope.openPopup) {
                if ($scope.progressBar) {
                    // open popup
                    $scope.uploadProgressPop.open().center()
                    $scope.openPopup = true
                    progressManualHandler(percent)
                    // overlay 를 show 못하는 버그가 있어 수동으로 처리
                    _.delay(function () { $('.k-overlay').show() }, 100)
                }
            }
            else if (percent > 0 && $scope.openPopup) {
                // progress
                if (percent) {
                    // progressBar 에 대한 변경 오류가 있어 수동으로 처리
                    progressManualHandler(percent)
                }
            }
            else if (percent === -1 && $scope.openPopup) {
                // close popup
                progressManualHandler(0)
                $scope.openPopup = false
                $scope.uploadProgressPop.close()
            }
        }

        // loading modal
        $scope.openLoadingPopup = false
        $scope.loadingTitle
        $rootScope.loadingProgressModal = function (cmd, title) {
            if ($scope.openLoadingPopup) {
                return
            }
            if (cmd === 'start' && !$scope.openLoadingPopup) {
                $scope.loadingPop.open().center()
                $scope.openLoadingPopup = true
            } else {
                $scope.loadingPop.close()
                $scope.openLoadingPopup = false
            }
            $scope.loadingTitle = title
        }

        // publish handler
        $scope.capturing = false
        $scope.publishHandler = function (cmdType) {

            var currentPageNumber = 0
            var allContents
            var offCallEvent
            var bookTitle

            function captureThumbnailImage () {

                if (allContents.length <= currentPageNumber) {
                    // 끝 - 출판 처리
                    offCallEvent()
                    console.log('end')
                    // 실제 만들 page id 만 골라낸다
                    var pickThumbnailData = {}
                    _.forEach($rootScope.thumbnailBase64Data, function (n, key) {
                        if (_.findWhere(allContents, {id: key})) {
                            pickThumbnailData[key] = n
                        }
                    })
                    console.log(pickThumbnailData)
                    // TODO: PublishService 연동 처리
                    PublishService.publish(cmdType, bookTitle, pickThumbnailData)

                } else {
                    // 진행
                    var id = allContents[currentPageNumber].id

                    currentPageNumber = currentPageNumber + 1

                    console.log('[capture]', id, currentPageNumber)
                    // 없으면 캡쳐
                    if (_.isUndefined($rootScope.thumbnailBase64Data[id])) {
                        $scope.capturing = true
                        // page 이동 후
                        $rootScope.commandPerformer('currentPageChange', id)
                        $timeout(function () {
                            // 캡쳐
                            $rootScope.commandPerformer('thumbnailCapture', id)
                        }, 300)
                    } else {
                        captureThumbnailImage()
                    }
                }
            }

            // thumbnail image data 수집
            function gleanThumbnail () {
                // 전체 페이지에 대한 체크 및 수집
                allContents = ContentsService.getContents()

                offCallEvent = $scope.$on('thumbnailImageUpdate', function (e, params) {
                    //currentPageNumber = currentPageNumber + 1
                    captureThumbnailImage()
                })

                // 시작
                captureThumbnailImage()
            }

            // 출판이면
            if (cmdType === 'publishBook') {
                var prompt = window.prompt('출판할 책 이름을 입력하세요.', '9Book')
                if (prompt !== null) {
                    // thumbnail 수집 단계 진행
                    bookTitle = prompt
                    gleanThumbnail()
                }
            } else {
                // thumbnail 수집 단계 진행
                gleanThumbnail()
            }
        }

        // global key event bind
        $rootScope.pressingKeyCode
        $(document).ready(function() {
            //angular.bootstrap(document, ['app'])
            $(document).keydown(function (e) {
                if ($rootScope.pressingKeyCode !== e.keyCode) {
                    console.log('itemKeyPress', e.keyCode)
                    $rootScope.pressingKeyCode = e.keyCode
                }
            }).keyup(function (e) {
                console.log('itemKeyUp')
                $rootScope.pressingKeyCode = undefined
            })
        })


        /*// key press event
        $scope.itemKeyPress = function (event) {
            console.log('itemKeyPress', event.keyCode)
            $rootScope.pressingKeyCode = event.keyCode
        }

        // key up event
        $scope.itemKeyUp = function (event) {
            console.log('itemKeyUp')
            $rootScope.pressingKeyCode = undefined
        }*/
    }

})