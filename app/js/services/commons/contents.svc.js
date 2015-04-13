'use strict'

define(function (require) {
    // @ngInject
    return function ContentsService ($http, $q, env, HttpService, FileService) {

        var service = {}
        var _contents
        var _contentsUrl = env.host + 'contents'
        var findContent = function (pageId) {
            if (_.isUndefined(pageId)) {
                return _contents
            }
            return _.findWhere(_contents, { '_id': pageId })
        }

        service.getContents = function () {
            return _contents
        }

        service.getContentsData = function (pageId) {
            var defer = $q.defer()

            if (_contents) {
                defer.resolve(findContent(pageId))
            } else {
                // get service
                HttpService.getService(_contentsUrl)
                    .then(function (data) {
                        _contents = data.data
                        defer.resolve(findContent(pageId))
                    })
                    .catch(function(error) {
                        console.error(error)
                    })
            }

            return defer.promise
        }

        service.setContentsData = function (id, contents) {
            //var defer = $q.defer()
            var findPageIndex

            if (_.isUndefined(id) || _.isUndefined(_contents)) {
                return
            }
            // array
            else if (_.isArray(id)) {
                _.forEach(id, function (n) {
                    findPageIndex = _.findIndex(_contents, {id: n})
                    _contents[findPageIndex].items = contents
                })
            }
            // string or number
            else {
                findPageIndex = _.findIndex(_contents, {id: id})
                _contents[findPageIndex].items = contents
            }

            return service.saveContentsData()

            /*HttpService.setService(_contentsUrl, _contents)
                .then(function (result) {
                    console.log('success')
                    defer.resolve(result)
                })
                .catch(function(error) {
                    console.error(error)
                    defer.resolve()
                })

            return defer.promise*/
        }

        service.addPage = function (addPageData) {
            var defer = $q.defer()
            _contents.push(addPageData)
            service.setContentsData(addPageData.id, []).then(function (result) {
                defer.resolve(result)
            })
            return defer.promise
        }

        service.addPages = function (addPagesData) {
            var defer = $q.defer()
            //_contents.push(addPageData)
            _contents = _contents.concat(addPagesData)
            service.setContentsData(_.map(addPagesData, 'id'), []).then(function (result) {
                defer.resolve(result)
            })
            return defer.promise
        }

        service.changePage = function (newListItems) {
            _contents = _.sortBy(_contents, function (n) {
                return _.result(_.findWhere(this, { id : n.id }), 'page') - 1
            }, newListItems)

            _.forEach(_contents, function (n, key) {
                n.page = key + 1
            })
            return service.saveContentsData()
        }

        service.deletePages = function (indexes) {
            var defer = $q.defer()
            var deletePageNames = []
            indexes = _.sortBy(indexes)
            _.forEach(indexes, function (index, key) {
                var deleteIndex = index - key
                if (_contents[deleteIndex].pageImage) {
                    // pages 삭제할 이미지 이름을 넣는다
                    deletePageNames.push(_contents[deleteIndex].pageImage)
                }
                _contents.splice(deleteIndex, 1)
                _.forEach(_contents, function (n, key) {
                    // 삭제하는 페이지 보다 높은 페이지
                    if (key > deleteIndex - 1) {
                        n.page = key + 1
                    }
                })
            })

            service.saveContentsData().then(function (resp) {
                defer.resolve(resp)
                // pages image 삭제
                if (deletePageNames.length > 0) {
                    //service.saveContentsData()
                    FileService.removeBgImages(deletePageNames)
                }
            })
            return defer.promise
        }

        service.changeBgImage = function (pageId, imageName) {
            var defer = $q.defer()
            var beforeImageName = _contents[_.findIndex(_contents, { id : pageId })].pageImage
            _contents[_.findIndex(_contents, { id : pageId })].pageImage = imageName
            service.saveContentsData().then(function (resp) {
                if(resp.data.result === 'success') {
                    // 이전 page image 삭제
                    if (beforeImageName) {
                        //service.saveContentsData()
                        FileService.removeBgImages([beforeImageName]).then(function (resp) {
                            defer.resolve(resp)
                        })
                    } else {
                        defer.resolve(resp)
                    }
                } else {
                    console.error('changeBgError')
                    defer.reject()
                }
            })
            return defer.promise
        }

        service.saveContentsData = function () {
            var defer = $q.defer()
            //_contents = newListItems
            HttpService.setService(_contentsUrl, _contents)
                .then(function (result) {
                    console.log('success')
                    defer.resolve(result)
                })
                .catch(function(error) {
                    console.error(error)
                    defer.resolve()
                })
            return defer.promise
        }

        service.getContentsLength = function () {
            return _contents.length
        }

        return service

    }
})