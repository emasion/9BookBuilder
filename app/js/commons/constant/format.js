'use strict'

define(function (require) {
    return {
        upload: {
            IMAGE_UPLOAD_FORMAT: ['.jpg', '.JPG', '.png', '.PNG', '.gif', '.GIF'],
            VIDEO_UPLOAD_FORMAT: ['.mp4', '.MP4', '.webm', '.WebM', '.wmv', '.WMV', '.avi', '.AVI', '.flv', '.FLV', '.mkv', '.MKV'],
            PDF_UPLOAD_FORMAT: ['.pdf', '.PDF'],
            DOC_UPLOAD_FORMAT: ['.pdf', '.PDF']
        }
    }
})