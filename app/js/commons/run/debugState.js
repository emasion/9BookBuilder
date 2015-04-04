'use strict'

define(function (require) {

    // @ngInject
    return function debugState ($log, $rootScope, $state) {
        $log.info('debugState')

        var states = $state.get()
        var routeMap = _(states).chain()
            .indexBy('name')
            .mapValues(function (state) { return state.url })
            .value()
        console.info('ROUTE MAP', routeMap)

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                $log.debug('debugStateEvents::' + event.name, {
                    event: event,
                    toState: toState,
                    toParams: toParams,
                    fromState: fromState,
                    fromParams: fromParams
                })
            })

        $rootScope.$on('$stateNotFound',
            function (event, unfoundState, fromState, fromParams) {
                $log.warn('debugStateEvents::' + event.name, {
                    event: event,
                    unfoundState: unfoundState,
                    fromState: fromState,
                    fromParams: fromParams
                })
            })

        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                $log.debug('debugStateEvents::' + event.name, {
                    event: event,
                    toState: toState,
                    toParams: toParams,
                    fromState: fromState,
                    fromParams: fromParams
                })
            })

        $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                $log.error('debugStateEvents::' + event.name, {
                    event: event,
                    toState: toState,
                    toParams: toParams,
                    fromState: fromState,
                    fromParams: fromParams,
                    error: error
                })
                $log.error(error.stack)
            })

        $rootScope.$on('$viewContentLoading',
            function (event, viewConfig) {
                $log.debug('debugStateEvents::' + event.name, {
                    event: event,
                    viewConfig: viewConfig
                })
            })

        $rootScope.$on('$viewContentLoaded',
            function (event) {
                $log.debug('debugStateEvents::' + event.name, {
                    event: event
                })
            })
    }

})