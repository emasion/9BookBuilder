/**
 * Created by 쩐율 on 2015-03-17.
 */

'use strict'

var fs = require('fs')
var configFilePath = 'app/public/json/config.json'

exports.getConfig = function (req, res) {
    // file read - 동기 방식으로 처리
    var configData = fs.readFileSync(configFilePath, 'utf8')
    //console.log(configData)
    res.json(JSON.parse(configData))
}

exports.putConfig = function (req, res) {
    // file update
}


exports.createConfig = function (req, res) {

}