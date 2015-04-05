
define(function (require) {

    'use strict'

    // @njInject
    return function ContainerViewController ($scope, $rootScope, ContentsService) {
        console.info('ContainerViewController')

        var contentsLoad = function (contents) {
            console.log('[contents]', contents)

            $scope.pageNumber = parseInt(contents.page)
            if (contents.items) {
                $scope.pageContents = _.clone(contents.items, true)
            }
            $scope.pageImage = contents.pageImage
        }

        var pageChangeHandler = function (event, id) {
            if (_.isUndefined(id)) {
                return
            }
            // get current contents
            ContentsService.getContentsData(id)
                .then(function (data) {
                    if (data) {
                        contentsLoad(data)
                    }
                })
        }

        var pageContentsChangedHandler = function (e, pageContents) {
            if (pageContents) {
                $scope.pageContents = pageContents
            }
        }

        // on viewChange event
        // 현재 선택되 있는 페이지의 컨텐츠 속성값 변경이 완료 되었을 때 발생
        $scope.$on('changedPageContents', pageContentsChangedHandler)
        // 선택한 페이지가 변경될 때 발생
        $scope.$on('currentPageChange', pageChangeHandler)

        // binding data
        $scope.pageNumber = 1
        $scope.pageContents
        $scope.pageImage

        // component context menu
        $scope.componentContextMenu = [
            { text: '복사', value: 'copyComponent' },
            { text: '삭제', value: 'deleteComponent' },
            { text: '레이어', child: [
                { text: '위로', value: 'topZIndexComponent' },
                { text: '맨위로', value: 'firstTopZIndexComponent' },
                { text: '아래로', value: 'bottomZIndexComponent' },
                { text: '맨아래로', value: 'lastBottomZIndexComponent' }
            ] }
        ]

        $scope.onMenuOpen = function (e) {
            //console.log('open')
        }

        $scope.onMenuClose = function (e) {
            //console.log('close')
        }

        $scope.onMenuSelect = function (e) {
            console.log($(e.item).children(".k-link").children('span').attr('data-value'))
            var selectCommand = $(e.item).children(".k-link").children('span').attr('data-value')

            // 선택한 context menu command 수행
            $rootScope.commandPerformer(selectCommand, $rootScope.selectComponent)
        }

        $scope.viewMouseDown = function () {
            $rootScope.commandPerformer('selectComponent')
        }

    }

})