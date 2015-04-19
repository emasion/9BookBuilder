/**
 * Created by emasion on 2015-04-15.
 */

'use strict'

var fs = require('fs-extra')
var Q = require('q')
//var mkdirp = require('mkdirp')
var _ = require('lodash')
var debug = require('debug')('publish')
var publishTempPath = 'app/viewer/preview/'
var bookResourcePath = 'app/viewer/resource/'
var publicSourcePath = 'app/public/'
var configConstant = require('../constant/config.js')

var copyPublicToTemp = function (tempPath) {
    var defer = Q.defer()
    var tempPublicPath = tempPath + '/public/'
    fs.copy(publicSourcePath, tempPublicPath, function (err) {
        if (err) {
            return console.error(err)
        }
        //console.log("success! copyPublicToTemp : ", tempPublicPath)
        console.log("success! copyPublicToTemp : %s", tempPublicPath)
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
        //console.log("success! copyResourceToTemp : ", tempPath)
        console.log("success! copyResourceToTemp : %s", tempPath)
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

    console.log("start! thumbnail total size %s", totalImageLength)

    _.forEach(imagesData, function (data, key) {
        var fileUrl = thumbnailImagePath + key + '.png'
        //console.log('[f]' + fileUrl)
        var imageData = data.split(',')[1]
        //console.log(imageData)
        console.log("& decoding!" + fileUrl + '-----------&%s', imageData.substr(0, 10))

        var decodedImage = new Buffer(imageData, 'base64')

        fs.writeFile(fileUrl, decodedImage, function (err) {
            if (err) {
                throw err
            }
            //console.log('File saved.' + key)
            console.log('**** File saved.' + key)
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

var configJsonParseProcess = function (tempPath, bookConfig) {
    var defer = Q.defer()
    var configJsonPath = tempPath + 'json/config.json'
    var constantBookConfig = configConstant.bookConfig

    //defer.resolve(true)
    console.log("success! configJsonParseProcess : ", configJsonPath)

    // TODO: Config.json read
    fs.readJson(configJsonPath, function (err, packageObj) {
        if (err) {
            throw err
        }
        console.log('[packageObj]', packageObj)

        // bookConfig default 값을 사용자가 등록한 config 정보와 합쳐서 저장
        var mergeBookConfig = _.extend(constantBookConfig, bookConfig)

        packageObj.bookConfig = mergeBookConfig

        fs.writeJson(configJsonPath, packageObj, function (error) {
            if (error) {
                throw error
            }
            defer.resolve(packageObj)
        })
    })

    return defer.promise
}

var contentsJsonParseProcess = function (tempPath) {
    var defer = Q.defer()
    var contentsJsonPath = tempPath + 'json/contents.json'
    var pagesJsonPath = tempPath + 'json/pages.json'

    //defer.resolve(true)
    console.log("success! contentsJsonParseProcess : ", contentsJsonPath)

    // TODO: contents.json read
    fs.readJson(contentsJsonPath, function (err, packageObj) {
        if (err) {
            throw err
        }
        console.log('[packageObj]', packageObj)

        var pagesJson = []

        _.forEach(packageObj, function (data) {
            pagesJson.push({
                "_id": data.page,
                "source": "public/pages/" + data.pageImage,
                "thumbnail": "public/thumbs/" + data._id + ".png",
                "caption": data.title
            })
        })


        fs.writeJson(pagesJsonPath, pagesJson, function (error) {
            if (error) {
                throw error
            }
            defer.resolve(pagesJson)
        })
    })

    return defer.promise
}

exports.publish = function (req, res) {

    // 출판 처리
    //console.log(req.body)

    var publishType = req.body.type
    var bookName = req.body.bookName
    var thumbnailData = req.body.thumbnail
    var bookConfig = req.body.bookConfig
    var tempFolder = publishTempPath + _.now()

    // TODO: resource 나 publish
    // TODO: 임시 폴더를 만들어야겠네.. 만들어서 resource 는 그 폴더를 띄워주고, publish 는 그 폴더를 복사해 준다.
    // create folder
    fs.mkdirs(tempFolder, function (err) {
        if (err) {
            console.error(err)
        } else {
            copyResourceToTemp(tempFolder).then(function (path) {
                //console.log('[thumbnailData]', req.body)
                Q.all([
                    makeThumbnailImages(path, thumbnailData),
                    configJsonParseProcess(path, bookConfig),
                    contentsJsonParseProcess(path)
                ]).then(function (result) {
                    res.json({
                        result: 'success',
                        tempPath: tempFolder.substr(tempFolder.indexOf('app/') + 3)
                    })
                })
            })
        }
    })


    // TODO: Config.json 파일을 9book viewer 구조에 맞게 분리 해서 생성
    // TODO: Thumbnail Data 를 thumbnail image 폴더에 생성



}