
define(function (require) {

    'use strict'

    // @njInject
    return function PublishWizardDirective () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                publishOptions: '='
            },
            templateUrl: 'templates/popup/publish.wizard.html',
            controller: function ($scope, $element, $timeout) {

                $scope.validate = function (event) {
                    event.preventDefault()

                    if ($scope.validator.validate()) {
                        $scope.validationMessage = "Hooray! Your tickets has been booked!"
                        $scope.validationClass = "valid"
                    } else {
                        $scope.validationMessage = "Oops! There is invalid data in the form."
                        $scope.validationClass = "invalid"
                    }
                }

                $scope.publishBtnClick = function () {
                    //console.log($scope.publishOptions)
                    $scope.$parent.gnOk($scope.publishOptions)
                    $scope.$parent.cancelClick()
                }
            },
            link: function () {

            }
        }
    }

})