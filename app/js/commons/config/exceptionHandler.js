'use strict'

define(function (require) {

    // @ngInject
    return function exceptionHandler ($provide) {
        $provide.decorator('$exceptionHandler', function ($delegate, $log) {
            return function (exception, cause) {
                exception.message += ' (caused by "' + cause + '")'
                $log.log('%cError: ' + exception.message, 'color: red')
                return $delegate(exception, cause)
            }
        })
    }

})