
define(function (require) {

    'use strict'

    // @njInject
    return function MainMenuController ($scope, $rootScope) {
        console.info('MainMenuController')

        $scope.menuOrientation = 'horizontal'
        // onSelect handler
        $scope.onSelect = function (e) {
            var cmd = $(e.item).attr('data-item')
            if (cmd) {
                $rootScope.commandPerformer(cmd)
            }
        }
    }
})