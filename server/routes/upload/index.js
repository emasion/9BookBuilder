/**
 * Created by 쩐율 on 2015-03-18.
 */

'use strict'

var fs = require('fs')
var _ = require('lodash')
var converterPdf = require('../../converter/converter.pdf')

exports.uploadImage = function (req, res) {

    var localPath = __dirname + '\\..\\..\\..\\app\\public\\contents\\'
    var imageName = req.files.imageFiles.name
    var destination = localPath + imageName

    console.log('[request] upload', req.files.imageFiles)
    fs.readFile(req.files.imageFiles.path, function (error, data) {
        //console.log(data, destination)
        fs.writeFile(destination, data, function (error) {
            if(error){
                console.error(error)
                throw error
            }else{
                res.json({
                    'result': 'success',
                    'data': {
                        name: imageName
                    }
                })
            }
        })
    })
}

exports.uploadBgImage = function (req, res) {

    var localPath = __dirname + '\\..\\..\\..\\app\\public\\pages\\'
    var imageName = req.files.bgImageFiles.name
    var destination = localPath + imageName

    console.log('[request] upload', req.files.bgImageFiles)
    fs.readFile(req.files.bgImageFiles.path, function (error, data) {
        //console.log(data, destination)
        fs.writeFile(destination, data, function (error) {
            if(error){
                console.error(error)
                throw error
            }else{
                res.json({
                    'result': 'success',
                    'data': {
                        name: imageName
                    }
                })
            }
        })
    })
}

exports.uploadVideo = function (req, res) {

    var localPath = __dirname + '\\..\\..\\..\\app\\public\\contents\\'
    var videoName = req.files.videoFiles.name
    var destination = localPath + videoName

    console.log('[request] upload', req.files)
    fs.readFile(req.files.videoFiles.path, function (error, data) {

        console.log(data, destination)

        // TODO : 비디오 파일 컨퍼터 처리
        fs.writeFile(destination, data, function (error) {
            if(error){
                console.error(error)
                throw error
            }else{
                res.json({
                    'result': 'success',
                    'data': {
                        name: videoName
                    }
                })
            }
        })
    })
}

exports.uploadPdf = function (req, res) {

    var localPath = __dirname + '\\..\\..\\..\\app\\public\\contents\\'
    var pdfName = req.files.pdfFiles.name
    var pdfId = _.now()
    var destination = localPath + pdfId + '.pdf'

    console.log('[request] upload', req.files)
    fs.readFile(req.files.pdfFiles.path, function (error, data) {
        console.log(data, destination)
        // contents 폴더에 pdf 를 저장 후
        fs.writeFile(destination, data, function (error) {
            if (error) {
                console.error(error)
                throw error
            } else {
                converterPdf.converterPdf(pdfId, function (params) {
                    // 먼저 upload return 한다
                    res.json({
                        'result': 'success',
                        'data': {
                            name: pdfName,
                            fileId: pdfId,
                            confData: params
                        }
                    })
                })
            }
        })
    })
}