
define(function (require) {

    'use strict'

    // @ngInject
    return function PageComponentDirective ($compile) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                pageContents: '=',
                pageImage: '=?',
                pageNumber: '='
            },
            templateUrl: '../../../../templates/component/page.html',
            controller: function ($rootScope, $scope, $element, $timeout, $q, ConfigService, ContentsService, ContentsCreateService) {

                $scope.pageWidth
                $scope.pageHeight
                $scope.pageStyle = {}
                $scope.pageImageUrl

                var $ = angular.element
                var self = this

                var zIndexListComponent = []

                var pagesPath = 'public/pages/'

                var configLayout

                var getConfig = function () {
                    var defer = $q.defer()
                    ConfigService.getConfigData().then(function (config) {
                        if (config && config.layout) {
                            $scope.pageWidth = config.layout.width
                            $scope.pageHeight = config.layout.height
                            $scope.pageStyle.width = $scope.pageWidth + 'px'
                            $scope.pageStyle.height = $scope.pageHeight + 'px'
                            configLayout = config.layout
                        }
                        defer.resolve(config)
                    })
                    return defer.promise
                }

                var init = function () {
                    // page size
                    getConfig()

                    // bgImage
                    if ($scope.pageImage) {
                        changeBgImage($scope.pageImage)
                    }

                    function changedZIndexComponents (items) {
                        // 외부에서 컴포넌트로 변경된 레이아웃 데이터를 전달할 때 사용
                        $rootScope.commandPerformer('layoutChangeComponent', items)
                        // change
                    }

                    // 한단계 zIndex 제어를 위한 메소드
                    function oneLevelZIndexChanger (id, upDown) {
                        var changeItemIndex = _.findIndex(zIndexListComponent, {id: id})
                        var changeItem = zIndexListComponent[changeItemIndex]
                        var changeZIndexValue = upDown ? changeItem.position.z + 1 : changeItem.position.z - 1
                        var subjectChangeIndex = _.findIndex(zIndexListComponent, function (component) {
                            return component.position.z === changeZIndexValue
                        })
                        var subjectChangeIndexItem = zIndexListComponent[subjectChangeIndex]
                        var subjectZIndexValue = changeItem.position.z

                        // subject 아이템이 없을 때 (제일 위나 제일 아래 index 일 경우 해당)
                        if (_.isUndefined(subjectChangeIndexItem)) {
                            return
                        }

                        // 한 단계 변경
                        changeItem.position.z = changeZIndexValue
                        zIndexListComponent[changeItemIndex] = changeItem

                        // subject 한 단계 변경
                        subjectChangeIndexItem.position.z = subjectZIndexValue
                        zIndexListComponent[subjectChangeIndex] = subjectChangeIndexItem

                        // 변경됨을 알릴 items
                        return [
                            changeItem,
                            subjectChangeIndexItem
                        ]
                    }

                    // 맨 위, 맨 아래 zIndex 제어를 위한 메소드
                    function lastLevelZIndexChanger (id, upDown) {
                        var changeItemIndex = _.findIndex(zIndexListComponent, {id: id})
                        var changeItem = zIndexListComponent[changeItemIndex]
                        var changeZIndexValue = upDown ? zIndexListComponent.length - 1 : 0
                        var subjectChangeIndexItems = []
                        var subjectZIndexValue = changeItem.position.z

                        if (changeItem.position.z === changeZIndexValue) {
                            return
                        }

                        // 변경될 아이템 찾아서 바꾼다
                        _.forEach(zIndexListComponent, function (item) {
                            if (upDown) {
                                // 맨 위로 올릴 때 - 현재 아이템 zIndex 가 subjectZIndexValue 보다 컸다면 변경 대상
                                if (item.position.z > subjectZIndexValue) {
                                    item.position.z = item.position.z - 1
                                    subjectChangeIndexItems.push(item)
                                }
                            } else {
                                // 맨 아래로 내릴 때 - 현재 아이템 zIndex 가 subjectZIndexValue 보다 작았다면 변경 대상
                                if (item.position.z < subjectZIndexValue) {
                                    item.position.z = item.position.z + 1
                                    subjectChangeIndexItems.push(item)
                                }
                            }
                        })

                        // 변경될 첫번째 아이템 변경한다
                        changeItem.position.z = changeZIndexValue
                        zIndexListComponent[changeItemIndex] = changeItem
                        subjectChangeIndexItems.push(changeItem)

                        // 변경됨을 알릴 items
                        return subjectChangeIndexItems
                    }

                    // 한 단계 index 를 올리고
                    function topZIndexHandler (e, id) {
                        changedZIndexComponents(oneLevelZIndexChanger(id, true))
                    }

                    // 한 단계 index 를 내리고
                    function bottomZIndexHandler (e, id) {
                        changedZIndexComponents(oneLevelZIndexChanger(id, false))
                    }

                    function firstTopZIndexHandler (e, id) {
                        changedZIndexComponents(lastLevelZIndexChanger(id, true))
                    }

                    function lastBottomZIndexHandler (e, id) {
                        changedZIndexComponents(lastLevelZIndexChanger(id, false))
                    }

                    function getCreatePosition () {
                        var highZValue = 0
                        var targetItem
                        // z index 가 가장 높은 component 를 찾는다

                        _.forEach($scope.pageContents, function (item) {
                            if (highZValue < item.position.z) {
                                targetItem = item
                                highZValue = item.position.z
                            }
                        })

                        return _.isObject(targetItem) ? {
                            x: targetItem.position.x + 5,
                            y: targetItem.position.y + 5,
                            z: targetItem.position.z + 1
                        } : {
                            x: 10,
                            y: 10,
                            z: 0
                        }
                    }

                    function addComponentHandler (e, type) {
                        var addContents = ContentsCreateService.createContents(type, $rootScope.currentPageId, getCreatePosition())
                        $scope.pageContents.push(addContents)
                        // 서버에 update
                        $rootScope.commandPerformer('changePageContents', $scope.pageContents)
                        // 화면에 update
                        createComponent(addContents)
                    }

                    function deleteComponentHandler (e, id) {
                        _.remove($scope.pageContents, function (n) {
                            return n.id === id
                        })
                        // 서버에 update
                        $rootScope.commandPerformer('changePageContents', $scope.pageContents)
                        // 화면에 update
                        removeComponent(id)
                    }

                    // 서버에 변경 된 bgImage 에 대한 처리
                    function changeBgImageHandler (e, imageName) {
                        ContentsService.changeBgImage($rootScope.currentPageId, imageName).then(function (resp) {
                            if(resp.status === 200) {
                                changeBgImage(imageName)
                                $rootScope.commandPerformer('changedBgImage', imageName)
                                $timeout(function () {
                                    $rootScope.commandPerformer('thumbnailCapture', $rootScope.currentPageId)
                                }, 500)
                            }
                            console.log(resp.data)
                        })
                    }

                    // page container zoom 변경 핸들러
                    function changeZoomHandler (e, zoomValue) {
                        // TODO: 전체 컴포넌트 사이즈를 zoomValue 를 곱한 값으로 표현
                        $element.css('zoom', zoomValue)

                        var event = $.Event( 'zoomChange' )
                        event.zoomValue = zoomValue
                        $element.children().trigger(event)

                        /*$element.css({
                            width: $scope.pageWidth * $rootScope.pageZoomValue,
                            height: $scope.pageHeight * $rootScope.pageZoomValue,
                        })*/

                        // resize max 사이즈 변경

                        resizeHandler()

                        //debugger
                    }

                    // 실제 page-component 에 변경 이미지 적용
                    function changeBgImage (imageName) {
                        console.log(imageName)
                        if (imageName === '' || imageName === null) {
                            imageName = undefined
                        }
                        $scope.pageStyle['background-image'] = imageName ? 'url(' + pagesPath + imageName + ')' : 'none'
                        //$scope.pageImageUrl = pagesPath + changeImage
                    }

                    // thumbnail capture 처리
                    function thumbnailCaptureHandler (e, id) {
                        html2canvas($element, {
                            onrendered: function (canvas) {
                                //var imageDataUrl = canvas.toDataURL("image/jpg")
                                //$('body').append('<img style="display: block;" src="' + imageDataUrl + '" />')
                                /**
                                * 서버에 image 저장 예제
                                **/
                                var dataURL = canvas.toDataURL('image/png')

                                $rootScope.commandPerformer('thumbnailImageUpdate', {
                                    id: id,
                                    imgBase64: dataURL
                                })
                                // 서버에 저장
                                /*$.ajax({
                                    type: "POST",
                                    url: "script.php",
                                    data: {
                                        imgBase64: dataURL
                                    }
                                }).done(function(o) {
                                    console.log('saved')
                                })*/
                            }
                        })
                    }

                    $rootScope.$on('topZIndexComponent', topZIndexHandler)
                    $rootScope.$on('bottomZIndexComponent', bottomZIndexHandler)
                    $rootScope.$on('firstTopZIndexComponent', firstTopZIndexHandler)
                    $rootScope.$on('lastBottomZIndexComponent', lastBottomZIndexHandler)
                    $rootScope.$on('addComponent', addComponentHandler)
                    $rootScope.$on('deleteComponent', deleteComponentHandler)
                    $rootScope.$on('changeBgImage', changeBgImageHandler)
                    $rootScope.$on('changeZoom', changeZoomHandler)
                    $rootScope.$on('thumbnailCapture', thumbnailCaptureHandler)

                    // pageContents watch
                    $scope.$watch('pageContents', function () {
                        contentsDestroy()
                        contentsInit()
                    })

                    // pageImage watch
                    $scope.$watch('pageImage', function (newPageImage) {
                        changeBgImage(newPageImage)
                    })

                    $(window).on('resize', _.debounce(resizeHandler, 200))
                    _.delay(function () {
                        resizeHandler()
                    }, 500)

                    // test - html2canvas test
                    /*$rootScope.$on('changeComponent', function () {

                        html2canvas($element[0], {
                            onrendered: function(canvas) {
                                var imageDataUrl = canvas.toDataURL("image/png")
                                $('body').append('<img style="display: block;" src="' + imageDataUrl + '" />')

                                *//*
                                *
                                *
                                * 서버에 image 저장 예제
                                * var dataURL = canvas.toDataURL();
                                 Send it to your server via Ajax

                                 $.ajax({
                                     type: "POST",
                                     url: "script.php",
                                     data: {
                                        imgBase64: dataURL
                                    }
                                 }).done(function(o) {
                                    console.log('saved');
                                     // If you want the file to be visible in the browser
                                     // - please modify the callback in javascript. All you
                                     // need is to return the url to the file, you just saved
                                     // and than put the image in your browser.
                                 });

                                * *//*
                            }
                        })

                    })*/
                }

                var addHandlerEl = function (container) {
                    var handlerNames = ['se', 'e', 'ne', 'n', 'nw', 'w', 'sw', 's']
                    var returnIds = {}
                    for(var i = 0; i < handlerNames.length; i++) {
                        var handlerId = $(container).attr('id') + handlerNames[i]
                        var handlerEl = $('<div/>').attr('id', handlerId).addClass('resize-handler').addClass('resize-' + handlerNames[i])
                        returnIds[handlerNames[i]] = '#' + handlerId
                        $(container).append(handlerEl)
                    }
                    return returnIds
                }

                var contentsDestroy = function () {
                    // 모두 제거 and unbind
                    $element.off()
                    $element.children().remove()
                }

                var contentsInit = function () {
                    zIndexListComponent = []
                    _.each($scope.pageContents, function (contentData, key) {
                        createComponent(contentData)
                    })
                }

                var createComponent = function (contentData) {
                    var $componentEl = $('<' + contentData.type + '-component>')
                    $componentEl.attr({
                        'id': contentData.id,
                        'get-options': 'getOptions(id)',
                        'get-size': 'getSize(id)'
                        // TODO: 다른 속성들 과 OPTIONS 값도 전부 넣어야 한다.
                    })
                    $element.append($compile($componentEl)($scope))
                    $componentEl.css({
                        'width': parseInt(contentData.size.width, 0),
                        'height': parseInt(contentData.size.height, 0),
                        'top': parseInt(contentData.position.y, 0),
                        'left': parseInt(contentData.position.x, 0),
                        'z-index': parseInt(contentData.position.z, 0)
                    })
                    $componentEl.addClass('component-content')
                    componentResizable($componentEl)

                    // zIndex component data save
                    zIndexListComponent.push({
                        id: contentData.id,
                        position: {
                            z: parseInt(contentData.position.z, 0)
                        }
                    })
                }

                var removeComponent = function (id) {
                    var removeElement = $element.find('#' + id)
                    removeElement.ResizableDestroy()
                    removeElement.unbind()
                    removeElement.remove()

                    _.remove(zIndexListComponent, function (n) {
                        return n.id === id
                    })
                }

                var componentResizable = function (element) {
                    $timeout(function () {
                        var handlerIds = addHandlerEl(element)

                        function resizableInit () {
                            $(element).Resizable(
                                {
                                    minWidth: parseInt(configLayout.component.minWidth),
                                    minHeight: parseInt(configLayout.component.minHeight),
                                    maxWidth: parseInt(configLayout.component.maxWidth),
                                    maxHeight: parseInt(configLayout.component.maxHeight),
                                    minTop: 0.1,
                                    minLeft: 0.1,
                                    maxRight: $scope.pageWidth,
                                    maxBottom: $scope.pageHeight,
                                    dragHandle: true,
                                    zoomValue: $rootScope.pageZoomValue,
                                    handlers: {
                                        se: handlerIds.se,
                                        e: handlerIds.e,
                                        ne: handlerIds.ne,
                                        n: handlerIds.n,
                                        nw: handlerIds.nw,
                                        w: handlerIds.w,
                                        sw: handlerIds.sw,
                                        s: handlerIds.s
                                    },
                                    onResize: function(size, position) {
                                        // TODO: resize handler
                                        //console.log('[resize]', size, position)
                                    },
                                    onStart: function () {
                                        // TODO: resize start handler
                                    },
                                    onStop: function () {
                                        mouseActionStopComponent(this)
                                    },
                                    onDrag: function (x, y) {
                                        //console.log('[drag]', x, y)
                                        //x = parseInt(x / $rootScope.pageZoomValue)
                                        //y = parseInt(y / $rootScope.pageZoomValue)
                                        //console.log('[drag change]', x, y)
                                        //return [x, y]
                                        // TODO: drag handler
                                    },
                                    onDragStart: function (x, y) {

                                        //x = parseInt(x * $rootScope.pageZoomValue)
                                        //y = parseInt(y * $rootScope.pageZoomValue)
                                        //console.log('[dragStart change]', x, y)

                                        //return [x, y]
                                    },
                                    //onDragStop: mouseActionStopComponent
                                    onDragStop: function (x, y) {
                                        mouseActionStopComponent(this)

                                        //x = parseInt(x / $rootScope.pageZoomValue)
                                        //y = parseInt(y / $rootScope.pageZoomValue)

                                        //return [x, y]
                                    }
                                }
                            )
                        }

                        if (_.isUndefined(configLayout)) {
                            getConfig().then(function () {
                                resizableInit()
                            })
                        } else {
                            resizableInit()
                        }
                    })
                }

                var mouseActionStopComponent = function (target) {
                    $rootScope.commandPerformer('changeComponent', {
                        id: target.id,
                        position: {
                            x: parseInt($(target).css('left'), 0),
                            y: parseInt($(target).css('top'), 0),
                            z: parseInt($(target).css('z-index'), 0)
                        },
                        size: {
                            width: parseInt($(target).css('width'), 0),
                            height: parseInt($(target).css('height'), 0)
                        }
                    })
                }

                var resizeHandler = function () {
                    var marginTop
                    if ($element.parents('.k-pane').height() > ($element.height() * $rootScope.pageZoomValue)) {
                        marginTop = ($element.parents('.k-pane').height() - ($element.height() * $rootScope.pageZoomValue)) / 2
                    } else {
                        marginTop = 0
                    }
                    TweenLite.to($element, 0.3, {marginTop: marginTop, ease: Back.easeOut})
                }

                // 각각의 options 정보를 contents component 에서 가져가기 위한 메소드
                $scope.getOptions = function (id) {
                    return _.result(_.findWhere($scope.pageContents, {'id' : id}), 'options')
                }

                // 각각의 size 정보를 contents component 에서 가져가기 위한 메소드
                $scope.getSize = function (id) {
                    return _.result(_.findWhere($scope.pageContents, {'id' : id}), 'size')
                }

                init()
            },

            link: function (scope, element) {
                /*var resizeHandler = function () {
                    var marginTop
                    if (element.parents('.k-pane').height() > element.height()) {
                        marginTop = (element.parents('.k-pane').height() - element.height()) / 2
                    } else {
                        marginTop = 0
                    }
                    TweenLite.to(element, 0.3, {marginTop: marginTop, ease: Back.easeOut})
                }
                $(window).on('resize', _.debounce(resizeHandler, 200))
                _.delay(function () {
                    resizeHandler()
                }, 500)*/
            }
        }
    }

})