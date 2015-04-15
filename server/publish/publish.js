/**
 * Created by emasion on 2015-04-15.
 */

'use strict'

var fs = require('fs-extra')
var Q = require('q')
//var mkdirp = require('mkdirp')
var _ = require('lodash')
var publishTempPath = 'app/viewer/preview/'
var bookResourcePath = 'app/viewer/resource/'
var publicSourcePath = 'app/public/'

var copyPublicToTemp = function (tempPath) {
    var defer = Q.defer()
    var tempPublicPath = tempPath + '/public/'
    fs.copy(publicSourcePath, tempPublicPath, function (err) {
        if (err) {
            return console.error(err)
        }
        console.log("success! copyPublicToTemp : ", tempPublicPath)
        defer.resolve(tempPublicPath)
    })
    return defer.promise
}

var copyResourceToTemp = function (tempPath) {
    var defer = Q.defer()
    fs.copy(bookResourcePath, tempPath, function (err) {
        if (err) {
            return console.error(err)
        }
        console.log("success! copyResourceToTemp : ", tempPath)
        // public data copy
        copyPublicToTemp(tempPath).then(function (path) {
            defer.resolve(path)
        })
    })
    return defer.promise
}

var makeThumbnailImages = function (tempPath, imagesData) {
    var defer = Q.defer()
    var thumbnailImagePath = tempPath + 'thumbs/'
    var totalImageLength = _.size(imagesData)
    var count = 0
    _.forEach(imagesData, function (data, key) {
        var fileUrl = thumbnailImagePath + key + '.png'
        console.log('[f]' + fileUrl)
        fs.writeFile(fileUrl, data, 'binary', function (err) {
            if (err) {
                throw err
            }
            console.log('File saved.' + key)
            count = count + 1
            //console.log(totalImageLength, count)
            if (totalImageLength <= count) {
                defer.resolve(true)
            }
        })
    })

    //console.log("success! makeThumbnailImages : ", imagesData)

    return defer.promise

}

var jsonParseProcess = function (tempPath) {
    var defer = Q.defer()

    defer.resolve(true)
    console.log("success! jsonParseProcess : ", tempPath)

    return defer.promise
}

exports.publish = function (req, res) {

    // 출판 처리
    console.log(req.body)

    var publishType = req.body.type
    var bookName = req.body.bookName
    var thumbnailData = req.body.thumbnail
    var tempFolder = publishTempPath + _.now()

    // TODO: resource 나 publish
    // TODO: 임시 폴더를 만들어야겠네.. 만들어서 resource 는 그 폴더를 띄워주고, publish 는 그 폴더를 복사해 준다.
    // create folder
    fs.mkdirs(tempFolder, function (err) {
        if (err) {
            console.error(err)
        } else {
            copyResourceToTemp(tempFolder).then(function (path) {
                console.log('[thumbnailData]', req.body)
                Q.all([
                    makeThumbnailImages(path, thumbnailData),
                    jsonParseProcess(path)
                ]).then(function (result) {
                    res.json({
                        result: 'success',
                        tempPath: path
                    })
                })
            })
        }
    })


    // TODO: Config.json 파일을 9book viewer 구조에 맞게 분리 해서 생성
    // TODO: Thumbnail Data 를 thumbnail image 폴더에 생성



}