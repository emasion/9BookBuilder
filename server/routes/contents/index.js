/**
 * Created by 쩐율 on 2015-03-17.
 */

'use strict'

var fs = require('fs')
var contentsFilePath = 'app/public/json/contents.json'

exports.getContents = function (req, res) {
    // file read - 동기 방식으로 처리
    fs.exists(contentsFilePath, function (exists) {
        if (exists) {
            var contentsData = fs.readFileSync(contentsFilePath, 'utf8')
            //console.log(configData)
            res.json(JSON.parse(contentsData))
        } else {
            this.createContents(function (data) {
                res.json(JSON.parse(data))
            })
        }
    })
}

exports.postContents = function (req, res) {
    // file update
    //console.log('[request] contents', req.body)
    fs.exists(contentsFilePath, function (exists) {
        if (exists) {
            fs.open(contentsFilePath, 'w', function (err, fd) {
                if(err) {
                    throw err
                }
                var buf = new Buffer(JSON.stringify(req.body, null, 4))
                fs.write(fd, buf, 0, buf.length, null, function (err, written, buffer) {
                    if(err) {
                        throw err
                    }
                    //console.log(err, written, buffer)
                    fs.close(fd, function() {
                        console.log('Update Contents.json')
                        res.json({'result': 'success'})
                    })
                })
            })
        } else {
            res.json({'result': 'fail', 'message': 'not found file'})
        }
    })
}

exports.createContents = function (callback) {
    var defaultContents = [
        {
            "_id": "page-000",
            "id": "page-000",
            "title": "page1",
            "page": "1",
            "items": []
        }
    ]

    fs.writeFile(contentsFilePath, defaultContents, function (err) {
        if(err) {
            return console.log(err)
        }
        callback(defaultContents)
    })
}