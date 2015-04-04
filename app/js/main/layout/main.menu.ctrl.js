
define(function (require) {

    'use strict'

    // @njInject
    return function MainMenuController ($scope) {
        console.info('MainMenuController')

        $scope.menuOrientation = 'horizontal'
        // onSelect handler
        $scope.onSelect = function (ev) {
            alert($(ev.item.firstChild).text())
        }
    }
})