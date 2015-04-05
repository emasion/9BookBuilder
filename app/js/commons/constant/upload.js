'use strict'

define(function (require) {
    return {
        image: {
            uploadName: 'imageFiles',
            format: 'IMAGE_UPLOAD_FORMAT',
            formatNotMatchMsg: '이미지 파일만 업로드 할 수 있습니다.',
            uploaderLocale: {
                select: '업로드',
                done: '',
                statusUploaded: ''
            },
            uploadUrl: 'upload/image',
            uploadMultiple: false,
            uploadShowFileList: false
        },
        bgImage: {
            uploadName: 'bgImageFiles',
            format: 'IMAGE_UPLOAD_FORMAT',
            formatNotMatchMsg: '이미지 파일만 업로드 할 수 있습니다.',
            uploaderLocale: {
                select: '업로드',
                done: '',
                statusUploaded: ''
            },
            uploadUrl: 'upload/bgimage',
            uploadMultiple: false,
            uploadShowFileList: false
        },
        video: {
            uploadName: 'videoFiles',
            format: 'VIDEO_UPLOAD_FORMAT',
            formatNotMatchMsg: '비디오 파일만 업로드 할 수 있습니다.',
            uploaderLocale: {
                select: '업로드',
                done: '',
                statusUploaded: ''
            },
            uploadUrl: 'upload/video',
            uploadMultiple: false,
            uploadShowFileList: false
        },
        mp3: {
            uploadName: 'audioFiles',
            format: 'AUDIO_UPLOAD_FORMAT',
            formatNotMatchMsg: '오디오 파일만 업로드 할 수 있습니다.',
            uploaderLocale: {
                select: '업로드',
                done: '',
                statusUploaded: ''
            },
            uploadUrl: 'upload/audio',
            uploadMultiple: false,
            uploadShowFileList: false
        },
        pdf: {
            uploadName: 'pdfFiles',
            format: 'PDF_UPLOAD_FORMAT',
            formatNotMatchMsg: 'PDF 파일만 업로드 할 수 있습니다.',
            uploaderLocale: {
                select: '업로드',
                done: '',
                statusUploaded: ''
            },
            uploadUrl: 'upload/pdf',
            uploadMultiple: false,
            uploadShowFileList: false
        }
    }
})