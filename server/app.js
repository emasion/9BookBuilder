'use strict'

// modules
var express = require('express')
var json = require('express-json')
var bodyParser = require('body-parser')
var multer  = require('multer')

// files
var conf = require('../config/gulp.config')
var routes = require('./routes')
var config = require('./routes/config')
var contents = require('./routes/contents')
var upload = require('./routes/upload')
var remove = require('./routes/remove')

// config
var serverPort = conf.port.server_dev

var fileUploadDone = false

// app
var app = express()
    .use(json())
    .use(bodyParser.urlencoded())
    //.use(express.json())
    //.use(express.multipart())
    .use(bodyParser.json())
    //.use(express.bodyParser())
    // cross domain
    .use(multer({
        dest: './uploads/',
        rename: function (fieldname, filename) {
            return filename + Date.now()
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...')
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path)
            fileUploadDone = true
        }
    }))
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*")
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
        res.header("Access-Control-Allow-Headers", "X-Requested-With")
        next()
    })
    .all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*")
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
        res.header("Access-Control-Allow-Headers", "X-Requested-With")
        next()
    })
    .get('/', routes.index)
    .get('/config', config.getConfig)
    .get('/contents', contents.getContents)
    .post('/contents', contents.postContents)
    .post('/upload/image', upload.uploadImage)
    .post('/upload/bgimage', upload.uploadBgImage)
    .post('/upload/video', upload.uploadVideo)
    .post('/upload/pdf', upload.uploadPdf)
    .post('/remove/files', remove.removeFiles)
    .post('/remove/folder', remove.removeFolder)
    .post('/remove/bgimages', remove.removeBgImages)
    .get('/test', function(req, res) {
        //res.sendfile('./.tmp/index.html')
        res.json({result: 'ok'})
    })
    .listen(serverPort)
