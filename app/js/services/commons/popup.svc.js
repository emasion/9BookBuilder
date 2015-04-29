
define([
  'angular'
], function(angular) {

  'use strict'

  // @ngInject
  return function PopupService ($compile, $timeout) {
    var $ = angular.element

    var gnPopup = {}

    gnPopup.open = function (scope, type, options) {

      scope.okClickHandler = undefined
      scope.okClickContentHandler = undefined
      scope.cancelClickHandler = undefined
      scope.resizeHandler = undefined

      // setting
      var gnPopup = $('<gn-popup/>')
      gnPopup.attr({
        'gn-type': type
      })

      if (!_.isUndefined(options.instance)) {
        gnPopup.attr({
          'gn-instance': options.instance
        })
      }
      if (!_.isUndefined(options.title)) {
        gnPopup.attr({
          'gn-title': options.title
        })
      }
      if (!_.isUndefined(options.content)) {
        gnPopup.attr({
          'gn-content': options.content
        })
      }
      if (!_.isUndefined(options.contentParams)) {
        gnPopup.attr({
          'gn-content-params': options.contentParams
        })
      }
      if (!_.isUndefined(options.modal)) {
        gnPopup.attr({
          'gn-modal': options.modal
        })
      }
      if (!_.isUndefined(options.okClick)) {
        scope.okClickHandler = options.okClick
        gnPopup.attr({
          'gn-ok': 'okClickHandler'
        })
      }
      if (!_.isUndefined(options.okClickContent)) {
        scope.okClickContentHandler = options.okClickContent
        gnPopup.attr({
          'gn-content-ok': 'okClickContentHandler'
        })
      }
      if (!_.isUndefined(options.cancelClick)) {
        scope.cancelClickHandler = options.cancelClick
        gnPopup.attr({
          'gn-cancel': 'cancelClickHandler'
        })
      }
      if (!_.isUndefined(options.position)) {
        gnPopup.attr({
          'gn-position': options.position
        })
      }
      if (!_.isUndefined(options.closeDestroy)) {
        gnPopup.attr({
          'gn-close-destroy': options.closeDestroy
        })
      }
      if (!_.isUndefined(options.resizeHandler)) {
        scope.resizeHandler = options.resizeHandler
        gnPopup.attr({
          'gn-resize': 'resizeHandler'
        })
      }
      if (!_.isUndefined(options.btnTitle)) {
        gnPopup.attr({
          'gn-btn-title': options.btnTitle
        })
      }
      if (!_.isUndefined(options.btnVisible)) {
        gnPopup.attr({
          'gn-btn-visible': options.btnVisible
        })
      }

      $('body').append($compile(gnPopup)(scope))

    }

    return gnPopup
  }
})
