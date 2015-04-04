
define(function (require) {

    'use strict'

    // @njInject
    return function FallbackSrcDirective () {
        return {
            link: function postLink (scope, iElement, iAttrs) {
                iElement.bind('error', function () {
                    angular.element(this).attr({
                        'src' : '',
                        'ng-src' : ''
                    }).css({
                        'background-image': 'url('+ iAttrs.fallbackSrc +')',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center',
                        'background-color': 'white'
                    })
                })
            }
        }
    }

})