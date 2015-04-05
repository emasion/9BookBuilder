/**
 * Created by 쩐율 on 2015-03-18.
 */

'use strict'

var fs = require('fs')
var _ = require('lodash')

exports.removeFiles = function (req, res) {
    var localPath = __dirname + '\\..\\..\\..\\app\\public\\contents\\'
    var deleteCount = 0
    console.log('[request] remove', req.body)
    console.log(_.isArray(req.body))
    if (_.isArray(req.body)) {
        var totalCount = req.body.length
        _.forEach(req.body, function (fileName) {
            //check
            fs.exists(localPath + fileName, function (exists) {
                if (exists) {
                    fs.unlink(localPath + fileName, function (err) {
                        if (err) {
                            throw err
                        }
                        console.log('successfully deleted : ' + fileName)
                        deleteCount++
                        if (deleteCount >= totalCount) {
                            res.json({'result': 'success'})
                        }
                    })
                } else {
                    res.json({'result': 'fail', 'message': 'not found file'})
                }
            })
        })
    }
}

exports.removeBgImage = function (req, res) {
    var localPath = __dirname + '\\..\\..\\..\\app\\public\\pages\\'
    console.log('[request] remove', req.body)
    function removeImage (imageName) {
        fs.exists(localPath + imageName, function (exists) {
            if (exists) {
                fs.unlink(localPath + imageName, function (err) {
                    if (err) {
                        throw err
                    }
                    console.log('successfully deleted : ' + imageName)
                    res.json({'result': 'success'})
                })
            } else {
                res.json({'result': 'fail', 'message': 'not found file'})
            }
        })
    }
    if (_.isString(req.body.name)) {
        removeImage(req.body.name)
    }
}


exports.removeFolder = function (req, res) {

    var localPath = __dirname + '\\..\\..\\..\\app\\public\\contents\\'

    console.log('[request] remove', req)

    console.log(req.files)

    // TODO: 삭제
}