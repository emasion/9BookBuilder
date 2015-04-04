
define(function (require) {

    'use strict'

    // @njInject
    return function RootController ($rootScope, $scope, $timeout, FileService) {
        console.info('RootController')

        var $ = angular.element

        $rootScope.currentPageId
        $rootScope.selectComponent

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

        // progress popup
        $scope.openPopup = false
        $scope.uploadStatus
        $scope.uploadProgress = 0
        $scope.progressBar
        $rootScope.uploadProgressModal = function (percent, fileName) {

            function progressManualHandler (value) {
                if ($scope.progressBar) {
                    $scope.progressBar.element.find('.k-state-selected').css({ width: value + '%'})
                    $scope.progressBar.element.find('.k-progress-status').text(value + '%')
                }
            }

            //var progressBar = $('#uploadProgressBar').data('kendoProgressBar')
            $scope.uploadStatus = fileName || 'upload file'

            if (!$scope.openPopup) {

                if ($scope.progressBar) {
                    // open popup
                    $scope.uploadProgressPop.open().center()
                    $scope.uploadProgress = 0
                    $scope.progressBar.value(percent)
                    $scope.openPopup = true
                }

            } else if (percent > 0 && $scope.openPopup) {
                // progress
                if ($scope.uploadProgress !== percent) {
                    //debugger
                    $scope.uploadProgress = percent
                    console.log($scope.uploadProgress)
                    // progressBar 에 대한 변경 오류가 있어 수동으로 처리
                    progressManualHandler(percent)
                }

            } else if (percent === -1 && $scope.openPopup) {
                // close popup
                $scope.uploadProgressPop.close()
                $scope.uploadProgress = 0
                $scope.openPopup = false
                progressManualHandler(0)
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