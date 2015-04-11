'use strict'

var gulp = require('gulp')
var child_process = require('child_process')
var exec = child_process.exec
//var spawn = require('child_process').spawn
var util = require('util')
var http = require('http')
var url = require('url')
var fs = require('fs')


var filename = 'test'

gulp.task('pdfToPng', function() {

    //Create a PDF with PDFKit
    /*var doc = new PDFDocument()
    doc.pipe(fs.createWriteStream('output/' + filename + '.pdf'))

    doc.fontSize(22);
    doc.text('Your file: '+filename+'.pdf', 20, 20)
    doc.fontSize(16);
    doc.text('Was created successfully if you see this.', 20, 30)

    doc.save()
    doc.moveTo(100, 150)
    doc.lineTo(100, 250)
    doc.lineTo(200, 250)
    doc.fill("#FF3300")
    doc.restore()

    doc.end()*/

    // Render PNG with GhostScript

    var currentPage = 1

    var commands = [
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
        '-sOutputFile=./uploads/' + filename + '_%04d' + '.png',
        './uploads/'+ filename +'.pdf'
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
            console.log('Created PNG: ' + filename + '.png')
        }
    })

    /*var spawn = child_process.spawn
    var oldSpawn = spawn

    function mySpawn() {
        console.log('spawn called')
        console.log(arguments)
        var result = oldSpawn.apply(this, arguments)
        return result
    }

    spawn = mySpawn

    var opts = [
        "-q ",
        "-dQUIET ",
        "-dPARANOIDSAFER ",
        "-dBATCH ",
        "-dNOPAUSE ",
        "-dNOPROMPT ",
        "-sDEVICE=png16m ",
        "-dTextAlphaBits=4 ",
        "-dGraphicsAlphaBits=4 ",
        "-r72 ",
        "-dFirstPage=" + currentPage + " ",
        "-dLastPage=" + currentPage + " ",
        "-sOutputFile=./uploads/" + filename + ".png ",
        "./uploads/" + filename + ".pdf"
    ]

    var gs = spawn( "gswin64c", opts )
    gs.stdout.on( 'data', function( data ) {
        console.log( 'stdout: ' + data )
    } )

    gs.stderr.on( 'data', function( data ) {
        console.log( 'stderr: ' + data )
    } )

    gs.on( 'close', function( code ) {
        console.log( 'child process exited with code ' + code )
    } )

    gs.on( 'error', function( error ) {
        console.error( '[error]' , error )
    } )
*/


})