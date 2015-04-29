
define(function (require) {

    'use strict'

    // @njInject
    return function ContainerSortableController ($scope, $rootScope, $q, $timeout, env, format, listItems, configData, ContentsService, ConverterService, PopupService) {
        console.info('ContainerSortableController')

        var $ = angular.element
        var sortableList = $('#sortableList')

        $scope.selectedIndex = 0
        $scope.selectedIndexes = [0]
        $scope.listItems = _.each(listItems, function (item) {
            item.id = item._id
        })

        $scope.placeholder = function(element) {
            return element.clone().addClass('placeholder').text('여기로 이동')
        }

        $scope.hint = function(element) {
            return element.clone().addClass('hint')
        }

        $scope.onChange = function (e) {
            var titleClassNm = '.item-title'
            var valueClassNm = '.item-value'
            var newListItems = []
            _.each(e.sender.items(), function (item, key) {
                newListItems.push({
                    title: $(item).find(titleClassNm).text(),
                    id: $(item).find(valueClassNm).val(),
                    page: key + 1
                })
            })
            $scope.changePageCall(newListItems).then(function () {
                // 선택된 아이템을 초기화
                $scope.selectedIndex = e.newIndex
                $scope.selectedIndexes = [$scope.selectedIndex]
                $scope.viewChange()
            })
        }

        $scope.changePageCall = function (newList) {
            var defer = $q.defer()
            // 서버에 변경내용 저장
            ContentsService.changePage(newList).then(function (resp) {
                if (resp.data.result === 'success') {
                    console.log('change Page success!!')
                    $scope.listItems = newList
                }
                defer.resolve(true)
            })
            return defer.promise
        }

        // item click handler
        $scope.isBeforeShiftKey = false   // 이전번째 shift key 를 눌러 작업했는지 여부
        $scope.cacheShiftKeyIndex   // shift key 작업을 시작했을 때 기준 인덱스를 저장
        $scope.itemClick = function (page) {
            // key event 와 연계 - ctrl : select item 추가, shift : 범위 item 추가
            if ($rootScope.pressingKeyCode) {
                // shift : 다중 범위 선택
                if ($rootScope.pressingKeyCode === 16) {
                    // $scope.selectedIndex 와 page - 1 과 비교해서 작은 수 부터 큰 수 까지 범위를 구하고 선택처리
                    var firstIndex, lastIndex, keyIndex

                    // 기준 인덱스를 설정하는데 이전에 shift key 작업을 했으면 이전 index 를 사용
                    keyIndex = $scope.isBeforeShiftKey ? $scope.cacheShiftKeyIndex : $scope.selectedIndex

                    // 첫 shift 작업 때만 저장
                    if (!$scope.isBeforeShiftKey) {
                        $scope.cacheShiftKeyIndex = $scope.selectedIndex
                    }

                    if (keyIndex < page - 1) {
                        firstIndex = keyIndex
                        lastIndex = page - 1
                    } else {
                        firstIndex = page - 1
                        lastIndex = keyIndex
                    }
                    $scope.selectedIndex = page - 1
                    $scope.selectedIndexes = []
                    for(var i = firstIndex; i <= lastIndex; i++) {
                        $scope.selectedIndexes.push(i)
                    }

                    $scope.isBeforeShiftKey = true

                }
                // ctrl : 다중 select 선택
                else if ($rootScope.pressingKeyCode === 17) {
                    $scope.isBeforeShiftKey = false
                    // $scope.selectedIndex 가 마지막에 클릭한 녀석으로 바뀌고, selectedIndexes 에 추가된다
                    $scope.selectedIndex = page - 1
                    // 원래 들어있었으면 제거하고, 없었으면 추가
                    if ($scope.selectedIndexes.indexOf($scope.selectedIndex) === -1) {
                        $scope.selectedIndexes.push($scope.selectedIndex)
                    } else {
                        $scope.selectedIndexes.splice($scope.selectedIndexes.indexOf($scope.selectedIndex), 1)
                        $scope.selectedIndex = $scope.selectedIndexes.length > 0 ? $scope.selectedIndexes[$scope.selectedIndexes.length - 1] : 0
                    }
                }
            }
            else {
                $scope.isBeforeShiftKey = false
                // select add class
                $scope.selectedIndex = page - 1
                $scope.selectedIndexes = [$scope.selectedIndex]
            }

            $scope.viewChange()
        }

        // item dbClick handler
        $scope.itemDBClick = function (e, page) {
            var selectedIndex = page - 1
            var target = $(e.currentTarget)
            var titleEl = target.find('.item-title')
            var inputEl = $('<input/>')
                .attr('type', 'text')
                .addClass('k-textbox')
                .css({
                    width: '100%',
                    'margin-right': '30px',
                    'text-indent': 0,
                    height: 'auto'
                })
                .val(titleEl.text())
                .on('keydown', function (e) {
                    // key enter handler
                    console.log('keydown', e)
                    if (e.keyCode === 13) {
                        changeTitle()
                    }
                    else if (e.keyCode === 27) {
                        removeTextInput()
                    }
                })
                .on('mousedown', function (e) {
                    console.log('mousedown', e)
                    e.preventDefault()
                    return false
                })
                .on('focusout', function (e) {
                    console.log('focusout', e)
                    // focus out handler
                    changeTitle()
                })


            function changeTitle () {
                var changeValue = inputEl.val()
                // 서버에 저장
                $scope.listItems[selectedIndex].title = changeValue
                $scope.changePageCall($scope.listItems)

                // 화면에 저장
                titleEl.text(changeValue)

                // removeTextInput
                removeTextInput()
            }

            function addTextInput () {
                titleEl.before(inputEl)
                titleEl.hide()
                inputEl.focus().select()
            }

            function removeTextInput () {
                inputEl.off()
                inputEl.remove()
                titleEl.show()
            }

            // input tag 추가
            addTextInput()
        }

        // 우측 main view 를 현재 selectedIndex 의 페이지로 교체 한다
        $scope.viewChange = function () {
            var id = $(sortableList).children('li').eq($scope.selectedIndex).find('input[type=hidden]').val()
            $rootScope.commandPerformer('currentPageChange', id)
        }

        // add PDF
        $scope.addPdf = function () {
            // TODO: PDF upload 로직 구현(propertyCtrl 참고) 및 서버 PDF 변환 기능 구현
            console.log('------------ pdf upload -------------')
        }

        var uploadFieldId
        $scope.uploadCallback = {
            onProgress: function (e) {},
            onSuccess: function (e) {
                uploadFieldId = e.response.data.fileId
            },
            onComplete: function () {
                var addPages
                var addItems = []

                // 100% 나 상태가 끝날때 까지 체크
                function checkProgress () {
                    //console.log('** checkProgress **', uploadFieldId)
                    ConverterService.converterProgress(uploadFieldId).then(function (result) {
                        //console.log('result]', result)
                        var resultData = result.data
                        if (resultData.result === 'success') {
                            // 진행중
                            if (resultData.status === 'converting') {
                                console.log('--------- converting -------- : ' + resultData.progress + '%')
                                $rootScope.uploadProgressModal(resultData.progress, '변환중')
                                _.delay(checkProgress, 1000)
                            }
                            // 변환 성공
                            else if (resultData.status === 'success') {
                                console.log('--------- file copy ing ---------')
                                $rootScope.loadingProgressModal('start', '불러오기 중')
                            }
                            // 완료
                            else if (resultData.status === 'complete') {
                                console.log('--------- complete ---------')
                                $rootScope.uploadProgressModal(-1, '변환중')
                                $rootScope.loadingProgressModal('end', '불러오기 중')
                                //console.log(result.files)
                                convertComplete(resultData.files)
                            }
                        }
                    })
                }

                function convertComplete (files) {
                    console.log('[complete converter files]', files.length)
                    addPages = files
                    _.forEach(addPages, function (pageName, key) {
                        var addPage = $scope.listItems.length + parseInt(key) + 1
                        addItems.push(makeAddItem(addPage, pageName))
                    })
                    // 서버에 추가
                    ContentsService.addPages(addItems).then(function (resp) {
                        if (resp.data.result === 'success') {
                            console.log('add pages success!!')
                            // 추가 완료 후 listItems 에 적용
                            $scope.listItems = resp.config.data
                        }
                    })
                }

                if (uploadFieldId) {
                    $timeout(function () {
                        $scope.$digest()
                        checkProgress()
                    })
                }
            }
        }

        // add page
        $scope.addPage = function () {
            //
            var addPage = $scope.listItems.length + 1
            var addItem = makeAddItem(addPage)

            // 서버에 추가
            ContentsService.addPage(addItem).then(function (resp) {
                if (resp.data.result === 'success') {
                    console.log('add page success!!')
                    $scope.listItems = resp.config.data
                    /*if ($scope.listItems.length !== resp.config.data.length) {
                        $scope.listItems.push(_.pick(resp.config.data[resp.config.data.length - 1], 'id', 'title', 'page'))
                    }*/
                }
            })
        }

        // delete pages
        $scope.deletePages = function () {
            if ($scope.selectedIndexes.length > 0) {

                PopupService.open($scope, 'confirm', {
                    title: '삭제 확인',
                    content: '"<p>선택된 페이지를 삭제하시겠습니까?</p>"',
                    modal: true,
                    okClick: function () {
                        // 서버에 삭제
                        $scope.selectedIndexes = _.sortBy($scope.selectedIndexes)
                        ContentsService.deletePages($scope.selectedIndexes).then(function (resp) {
                            if (resp.data.result === 'success') {
                                console.log('remove page success!!')
                                $scope.listItems = resp.config.data
                                // 삭제 후 다른 페이지 선택 : 마지막인 페이지는 -1 나머지는 지운 갯수 만큼 빼준 인덱스로 viewChange
                                if ($scope.selectedIndex >= resp.config.data.length) {
                                    $scope.selectedIndex = resp.config.data.length - 1
                                } else {
                                    $scope.selectedIndex = $scope.selectedIndex - _.filter($scope.selectedIndexes, function (n) {
                                            return $scope.selectedIndex > n
                                        }).length
                                }
                                $scope.selectedIndexes = $scope.selectedIndex < 0 ? [] : [$scope.selectedIndex]
                                $scope.viewChange()
                            }
                        })
                    }
                })
            }
        }

        $scope.onLoaded = function () {
            $('.sortable-buttons > [type=button]').css({'padding': 0})
            $('.sortable-buttons').find('.k-upload-button').addClass('k-primary')
            $('.sortable-buttons').find('.k-upload-button').find('span').prepend('<i class="fa fa-file-text" style="margin-right: 3px;"></i>')
        }

        $timeout(function () {
            init()
        })

        var addOnEvent = function () {
            $scope.$on('addPdf', function () {
                $rootScope.uploadSelectFile('pdf', $scope.uploadCallback)
            })
            $scope.$on('addPage', function () {
                $scope.addPage()
            })
            $scope.$on('removePage', function () {
                $scope.deletePages()
            })
            /*$scope.$on('viewPage', function (e, index) {
                $scope.selectedIndex = index
                $scope.selectedIndexes = index
                $scope.viewChange()
            })*/
        }

        var init = function () {
            $scope.viewChange()
            $timeout(function () {
                $scope.onLoaded()
            })
            addOnEvent()
        }

        var makeAddItem = function (page, bgImageName) {
            var pageId = _.uniqueId(configData.bookId + '_' + new Date().getTime())
            var addItem = {
                title: '새 페이지',
                id: pageId,
                _id: pageId,
                page: page,
                items: []
            }
            if (bgImageName) {
                addItem.pageImage = bgImageName
            }
            return addItem
        }
    }

})