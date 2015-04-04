'use strict'

define(function (require) {
    // @ngInject
    return function ContentsCreateService ($http, $q, env, HttpService) {

        var service = {}
        var DEFAULT_SIZE = 50

        service.options = {
            image: {
                "linkUrl": "",
                "linkTarget": "_blank",
                "title": "Image",
                "text": "Image"
            },
            link: {
                "linkUrl": "",
                "linkTarget": "_blank",
                "bgColor": "#333333",
                "bgColorHover": "#ffffff",
                "opacity": "0.3",
                "title": "Link"
            },
            text: {
                "text": "<p></p>",
                "opacity": 1,
                "bgColor": "#333333",
                "fontColor": "#f3f3f3"
            },
            video: {
                "text": "",
                "videoTitle": "비디오"
            }
        }

        service.createId = function (type) {
            return _.uniqueId(type) + new Date().getTime()
        }

        service.createContents = function (type, pageId, position) {
            var contentData = {
                "id": service.createId(type),
                "type": type,
                "position": position,
                "size": {
                    "width": DEFAULT_SIZE,
                    "height": DEFAULT_SIZE
                },
                "options": _.clone(service.options[type], true)
            }
            console.log(contentData, pageId)
            return contentData
        }

        return service

    }
})