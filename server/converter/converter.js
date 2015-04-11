/**
 * Created by emasion on 2015-04-11.
 */
'use strict'

var fs = require('fs')
var _ = require('lodash')
var Q = require('q')
var converterList = []

function checkProgress (id, res) {
    //var defer = Q.defer()
    // TODO: 실제 임시 폴더에 가서 총 페이지 수와 현재 만들어진 페이지 수를 비교해서 퍼센트를 낸다
    var findProgressConfig = _.findWhere(converterList, {id: id})
    if (findProgressConfig) {
        var tempFolder = findProgressConfig.folder
        var totalPages = findProgressConfig.totalPages
        var status = findProgressConfig.status
        if (status === 'complete') {
            // end
            /*defer.resolve({
                status: status,
                percent: 100
            })*/
            res.json({
                'result': 'success',
                'status': status,
                'progress': 100,
                'files': findProgressConfig.files,
                'message': 'complete'
            })
        } else {
            fs.readdir(tempFolder, function (err, files) {
                if (err) {
                    defer.reject(new Error(error))
                }
                console.log('변환 ing length : ', files.length + ' / ' + totalPages)
                var currentCount = files.length
                /*defer.resolve({
                    status: status,
                    percent: (currentCount / totalPages) * 100
                })*/
                res.json({
                    'result': 'success',
                    'status': status,
                    'progress': Math.round((currentCount / totalPages) * 100),
                    'message': 'progressing'
                })
            })
        }
    } else {
        res.json({
            'result': 'success',
            'status': 'fail',
            'progress': -1,
            'files': [],
            'message': 'not converting data'
        })
        /*defer.resolve({
            status: 'fail',
            percent: -1
        })*/
    }
    //return defer.promise
}

exports.setConverterConfig = function (config) {
    // TODO: 변환 정보를 등록해서 getProgress 에서 꺼내 갈 수 있도록 한다
    converterList.push(config)
    console.log('[setConverterConfig]', config)
}

exports.successConverter = function (id) {
    // 등록했던 변환 정보 변경 : 변환 완료
    _.forEach(converterList, function (n) {
        if (n.id === id) {
            n.status = 'success'
        }
    })
}

exports.completeConverter = function (id, files) {
    // 등록했던 변환 정보 변경 : 변환 종료
    _.forEach(converterList, function (n) {
        if (n.id === id) {
            n.status = 'complete'
            n.files = files
        }
    })
}

var test = 0
exports.getProgress = function (req, res) {
    // TODO: 현재 진행중인 변환 파일 정보를 읽어서 return 해준다
    console.log('------------- get progress params : ', req.body.id)
    //console.log(res)

    checkProgress(req.body.id, res)

/*    checkProgress(req.body.id).then(function (params) {
        console.log('-------------- check progress : ', params)
        res.json({
            'result': 'success',
            'status': params.status,
            'progress': params.progress,
            'files': params.files,
            'message': progress === -1 ? 'not progressing converter' : 'progressing'
        })
    })*/

    /*res.json({
        'result': 'success',
        'status': 'converting',
        'progress': test++,
        'files': [],
        'message': 'progressing'
    })*/
}