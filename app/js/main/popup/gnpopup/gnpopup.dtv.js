
define(function (require) {
  'use strict'

  // @ngInject
  return function GnPopupDirective ($log, $timeout, $compile) {
    // directive code...
    return {
      restrict: 'EA',
      scope : {
        gnInstance: '=?',
        gnType: '@?',
        gnUseSymbol: '=?',
        gnTitle: '@?',
        gnContent: '=',
        gnContentParams: '=?',
        gnModal: '=?',
        gnOk: '=?',
        gnContentOk: '=?',
        gnCancel: '=?',
        gnPosition: '=?',
        gnCloseDestroy: '=?',
        gnOpenInit: '=?',
        gnResize: '=?',
        gnBtnTitle: '=?',
        gnVisible: '=?',
        gnBtnVisible: '=?'
      },
      replace: true,
      transclude: true,
      templateUrl: 'js/main/popup/gnpopup/gnpopup.tpl.html',
      controller: function ($scope, $element, $timeout) {

        var getDefaultTitle = function () {
          var title
          switch ($scope.gnType) {
            case 'alert':
              title = '경고'
              break
            case 'notice':
              title = '알림'
              break
            case 'confirm':
              title = '확인'
              break
            case 'success':
              title = '완료'
              break
            case 'error':
              title = '에러'
              break
            default :
              title = '팝업'
          }
          return title
        }

        var getSymbolClass = function () {
          var iconClass
          switch ($scope.gnType) {
            case 'alert':
              iconClass = 'fa-exclamation-triangle'
              break
            case 'notice':
              iconClass = 'fa-exclamation-circle'
              break
            case 'confirm':
              iconClass = 'fa-question-circle'
              break
            case 'success':
              iconClass = 'fa-check-circle'
              break
            case 'error':
              iconClass = 'fa-minus-circle'
              break
            default :
              iconClass = ''
          }
          return 'gn-' + $scope.gnType + ' win-symbol fa fa-3x ' + iconClass
        }

        var initContent = function () {
          $element.find('#winContainer').children().off()
          $element.find('#winContainer').empty()
          $element.find('#winContainer').append($compile($scope.gnContent)($scope))
        }

        var init = function () {
          $scope.win = _.uniqueId('win')
          $scope.winTitle = $scope.gnTitle || getDefaultTitle()
          $scope.winModal = _.isUndefined($scope.gnModal) ? true : $scope.gnModal // default true
          $scope.winPosition = $scope.gnPosition || 'center'
          $scope.winSymbolClass = _.isUndefined($scope.gnUseSymbol) ? getSymbolClass() : (($scope.gnUseSymbol === false) ? undefined : getSymbolClass()) // default true
          $scope.okText = ($scope.gnBtnTitle && $scope.gnBtnTitle[0]) ? $scope.gnBtnTitle[0] : '확인'
          $scope.cancelText = ($scope.gnBtnTitle && $scope.gnBtnTitle[1]) ? $scope.gnBtnTitle[1] : '취소'
          $scope.winResizable = _.isUndefined($scope.gnResize) ? false : ((typeof $scope.gnResize === 'function') ? true : $scope.gnResize) // default false
          $scope.winVisible = _.isUndefined($scope.gnVisible) ? true : $scope.gnVisible
          $scope.winOkShow = $scope.gnBtnVisible === false ? false : (_.isUndefined($scope.gnOk) && _.isUndefined($scope.gnContentOk)) ? ($scope.gnType ? true : false) : true
          $scope.winCloseShow = $scope.gnBtnVisible === false ? false : _.isUndefined($scope.gnCancel) ? ($scope.gnType === 'confirm' ? true : false) : true

          //$element.find('#winContainer').append($compile($scope.gnContent)($scope))
          initContent()

          // add event
          $scope.winOpen = function () {
            if ($scope.winPosition === 'center') {
              kendo.widgetInstance($element).center()
            }
          }

          $scope.winClose = function () {
            destroy()
          }

          $scope.winResize = function () {
            if (typeof $scope.gnResize === 'function') {
              $scope.gnResize($scope.win)
            }
          }

          $scope.okClick = function () {
            // content callback ok 처리
            if (typeof $scope.gnContentOk === 'function') {
              $scope.gnContentOk($element.find('#winContainer').children())
            }
            // 그냥 ok 처리
            if (typeof $scope.gnOk === 'function') {
              $scope.gnOk()
            }
            $scope.win.close()
            destroy()
          }

          $scope.cancelClick = function () {
            console.log('cancel')
            if (typeof $scope.gnCancel === 'function') {
              $scope.gnCancel()
            }
            $scope.win.close()
            destroy()
          }

          // contents params 에 등록된 녀석들을 $scope 에 등록 : contents 객체에서 scope 로 받아서 쓸수 있도록
          if ($scope.gnContentParams && _.isObject($scope.gnContentParams)) {
            _.forEach($scope.gnContentParams, function (n, key) {
              $scope[key] = n
            })
          }

          $timeout(function () {
            $scope.gnInstance = $scope.win
          }, 100)
        }

        var destroy = function () {
          if ($scope.gnCloseDestroy !== false && $scope.gnCloseDestroy !== 'false') {
            $scope.win.destroy()
          } else {
            if ($scope.gnOpenInit) {
              // content 새로 등록
              initContent()
            }
          }
        }

        init()
      },
      link: function (scope, element) {
      }
    }
  }
})