/**
 * Created by 쩐율 on 2015-04-04.
 */
'use strict'

var converter = require('./converter.js')
var PDFParser = require('pdf2json/pdfparser')
var child_process = require('child_process')
var exec = child_process.exec
var spawn = child_process.spawn
var fs = require('fs')
var mkdirp = require('mkdirp')
var _ = require('lodash')

var localPath = __dirname + '\\..\\..\\app\\public\\contents\\'
var pagesPath = __dirname + '\\..\\..\\app\\public\\pages\\'

exports.converterPdf = function (pdfId, callback) {

    var self = this
    var fileName = pdfId
    var tempFolder = pagesPath + fileName + '\\'

    console.log('[temp folder]', tempFolder)

    // create folder
    mkdirp(tempFolder, function (err) {
        if (err) {
            console.error(err)
        } else {
            pdfToPng()
        }
    })

    // get PDF length
    var pdfParser = new PDFParser()
    pdfParser.on("pdfParser_dataReady", _.bind(onPFBinDataReady, self))
    var pdfFilePath = localPath + fileName + '.pdf'
    fs.readFile(pdfFilePath, function (err, pdfBuffer) {
        if (!err) {
            pdfParser.parseBuffer(pdfBuffer)
        }
    })

    function onPFBinDataReady (evtData) {
        console.log('--------------PDFBindDataReady ', evtData.data.Pages.length)
        // 변환 정보 등록
        var confData = {
            id: pdfId,
            totalPages: evtData.data.Pages.length,
            folder: tempFolder,
            status: 'converting'
        }
        converter.setConverterConfig(confData)
        // pdf file read 후 완료 리턴
        callback(confData)
    }

    function pdfToPng () {

        var opts = [
            "-dQUIET",
            "-dPARANOIDSAFER",
            "-dBATCH",
            "-dNOPAUSE",
            "-dNOPROMPT",
            "-sDEVICE=png16m",
            "-dTextAlphaBits=4",
            "-dGraphicsAlphaBits=4",
            "-r150",
            '-sOutputFile=' + tempFolder + fileName + '_%04d' + '.png',
            localPath + fileName + '.pdf'
        ]

        //console.log( 'opts: ', opts)

        var gs = spawn( "gswin64c", opts )
        gs.stdout.on( 'data', function( data ) {
            //console.log( 'stdout: ' + data )
        } )

        gs.stderr.on( 'data', function( data ) {
            //console.log( 'stderr: ' + data )
        } )

        gs.on('close', function( code ) {
            //console.log( 'child process exited with code ' + code )

            // 변환 종료 알림

            fs.readdir(tempFolder, function (err, files) {
                console.log('변환 files', files)

                converter.successConverter(pdfId, files)

                // pages 아래로 복사
                var totalCount = files.length
                var moveCount = 0
                files.forEach(function (file) {
                    fs.rename(tempFolder + file, pagesPath + file, function (err) {
                        if (err) {
                            throw err
                        }
                        moveCount = moveCount + 1
                        if (moveCount >= totalCount) {
                            console.log('renamed complete')
                            // temp 폴더 삭제
                            fs.rmdir(tempFolder, function (error) {
                                // error
                                if (error) {
                                    throw error
                                }
                                // 완료
                                //callback(files)
                                converter.completeConverter(pdfId, files)
                            })
                        }
                    })
                })
            })
        } )

        gs.on( 'error', function( error ) {
            console.error( '[error]' , error )
        } )
    }
}