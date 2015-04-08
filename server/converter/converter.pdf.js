/**
 * Created by 쩐율 on 2015-04-04.
 */
'use strict'

var child_process = require('child_process')
var exec = child_process.exec
var spawn = child_process.spawn
var fs = require('fs')
var mkdirp = require('mkdirp')

var localPath = __dirname + '\\..\\..\\app\\public\\contents\\'
var pagesPath = __dirname + '\\..\\..\\app\\public\\pages\\'

exports.converterPdf = function (pdfId, callback) {

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

    function pdfToPng () {
        /*var commands = [
            'gswin64c',
            '-dQUIET',
            '-dPARANOIDSAFER',
            '-dBATCH',
            '-dNOPAUSE',
            '-dNOPROMPT',
            '-sDEVICE=png16m',
            '-dTextAlphaBits=4',
            '-dGraphicsAlphaBits=4',
            '-r150',
            //'-dFirstPage=' + currentPage,
            //'-dLastPage=' + currentPage,
            '-sOutputFile=' + tempFolder + pdfName + '_%04d' + '.png',
            localPath + pdfName
        ]

        exec(commands.join(' '), function (error, stdout, stderr) {

            if ( error !== null ) {
                console.log(error)
            }
            else if ( stdout !== null ) {
                console.log(stdout)
            }
            else {
                //var img = fs.readFileSync('../uploads/' + filename + '.png')
                //res.writeHead(200, {'Content-Type': 'image/png' })
                //res.end(img, 'binary')
                console.log('Created PNG: ' + pdfName + '.png')


                // TODO : 변환 되었다는 가정하에
                fs.readdir(tempFolder, function (err, files) {
                    console.log('변환 files', files)
                    callback(files)
                })
            }

            console.log('exec response')
        })
*/

        /*var oldSpawn = spawn

        function mySpawn() {
            console.log('spawn called')
            console.log(arguments)
            var result = oldSpawn.apply(this, arguments)
            return result
        }

        spawn = mySpawn*/

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

        console.log( 'opts: ', opts)

        var gs = spawn( "gswin64c", opts )
        gs.stdout.on( 'data', function( data ) {
            console.log( 'stdout: ' + data )
        } )

        gs.stderr.on( 'data', function( data ) {
            console.log( 'stderr: ' + data )
        } )

        gs.on('close', function( code ) {
            console.log( 'child process exited with code ' + code )
            fs.readdir(tempFolder, function (err, files) {
                console.log('변환 files', files)
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
                                callback(files)
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