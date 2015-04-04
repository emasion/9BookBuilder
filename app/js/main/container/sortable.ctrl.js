
define(function (require) {

    'use strict'

    // @njInject
    return function ContainerSortableController ($scope, $rootScope, $timeout, env, listItems, configData, ContentsService) {
        console.info('ContainerSortableController')

        var $ = angular.element
        var sortableList = $('#sortableList')
        var UPLOAD_FILE_FORMAT = ['.pdf', '.PDF']

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
            $scope.changePageCall(newListItems)
        }

        $scope.changePageCall = function (newList) {
            // 서버에 변경내용 저장
            ContentsService.changePage(newList).then(function (resp) {
                if (resp.data.result === 'success') {
                    console.log('add page success!!')
                    $scope.listItems = newList
                }
            })
        }

        // item click handler
        $scope.isBeforeShiftKey = false   // 이전번째 shift key 를 눌러 작업했는지 여부
        $scope.cacheShiftKeyIndex   // shift key 작업을 시작했을 때 기준 인덱스를 저장
        $scope.itemClick = function (page) {
            // TODO: key event 와 연계 - ctrl : select item 추가, shift : 범위 item 추가
            if ($rootScope.pressingKeyCode) {
                // shift : 다중 범위 선택
                if ($rootScope.pressingKeyCode === 16) {
                    // TODO: $scope.selectedIndex 와 page - 1 과 비교해서 작은 수 부터 큰 수 까지 범위를 구하고 선택처리
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

        $scope.uploadUrl = env.host + 'upload/pdf'
        $scope.uploaderLocale = {
            select: 'PDF',
            done: '',
            statusUploaded: ''
        }

        // upload 할 이미지 선택시 event
        $scope.onSelect = function (e) {
            var selectOk = true
            _.forEach(e.files, function (value) {
                if (!_.findWhere(UPLOAD_FILE_FORMAT, value.extension)) {
                    e.preventDefault()
                    alert('PDF 파일만 업로드 할 수 있습니다.')
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
        }

        // progress
        $scope.onProgress = function (e) {
            $rootScope.uploadProgressModal(e.percentComplete, e.files[0].name)
            $scope.$apply()
        }

        // upload 성공시
        $scope.onSuccess = function (e) {
            var response = e.response
            var fileName = response.data.name
            var addPages
            var addItems = []

            if (response.result === 'success') {
                console.log('[success upload pdf]', response)
                addPages = response.data.pages

                _.forEach(addPages, function (pageName, key) {
                    var addPage = $scope.listItems.length + parseInt(key) + 1
                    addItems.push(makeAddItem(addPage, pageName))
                })

                // 서버에 추가
                ContentsService.addPages(addItems).then(function (resp) {
                    if (resp.data.result === 'success') {
                        console.log('add pages success!!')
                        $scope.listItems = resp.config.data
                        /*if ($scope.listItems.length !== resp.config.data.length) {
                         $scope.listItems.push(_.pick(resp.config.data[resp.config.data.length - 1], 'id', 'title', 'page'))
                         }*/
                    }
                })

            }

            $scope.$digest()

            // TODO: 받아온 변환 pages Images 를 바탕으로 페이지 추가 기능 구현
        }

        // pdf upload 완료시
        $scope.onComplete = function (e) {
            $rootScope.ingUpload = false
            $rootScope.uploadProgressModal(-1)
            $scope.$apply()
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
                        $scope.selectedIndexes = [$scope.selectedIndex]
                        $scope.viewChange()
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

        var init = function () {
            $scope.viewChange()
            $timeout(function () {
                $scope.onLoaded()
            })
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