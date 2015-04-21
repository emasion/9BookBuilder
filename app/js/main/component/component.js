'use strict'

define(function (require) {
    // @ngInject
    return function Component ($rootScope) {

        var $ = angular.element

        function Component (el, id, options) {
            this.el = el
            this.id = id
            this.options = options
            this._attr = []
            this.visualZoom = 1
            this.render()
            this.addEvent()
        }

        Component.prototype.render = function () {
            // SELECT AREA 생성
            // click event handler

            var self = this
            var selectArea = $('<div/>').addClass('component-select-area')
            $(self.el).prepend(selectArea)

            self.set('selectArea', selectArea)
            self.selectAreaShow(false)
            self.handlerShow(false)
        }

        Component.prototype.addEvent = function () {
            this.onClick()
            this.onChangeLayout()
            this.onSelectionChange()
        }

        Component.prototype.onClick = function () {
            var self = this
            $(self.el).on('mousedown', function () {
                // 클릭한 컴포넌트 선택
                self.selectAreaShow(true)
                self.handlerShow(true)
                // event trigger
                $rootScope.commandPerformer('selectComponent', self.id)
            })
        }

        Component.prototype.updateLayoutData = function () {
            var self = this
            $rootScope.commandPerformer('changeComponent', {
                id: self.id,
                position: {
                    x: parseInt($(self.el).css('left'), 0),
                    y: parseInt($(self.el).css('top'), 0),
                    z: parseInt($(self.el).css('z-index'), 0)
                },
                size: {
                    width: parseInt($(self.el).css('width'), 0),
                    height: parseInt($(self.el).css('height'), 0)
                }
            })
        }

        Component.prototype.onChangeLayout = function () {
            var self = this

            function changeCssComponent (values) {
                if (!_.isUndefined(values.position) && !_.isUndefined(values.position.z)) { $(self.el).css('z-index',  parseInt(values.position.z, 0)) }
                if (!_.isUndefined(values.position) && !_.isUndefined(values.position.x)) { $(self.el).css('left', parseInt(values.position.x, 0)) }
                if (!_.isUndefined(values.position) && !_.isUndefined(values.position.y)) { $(self.el).css('top', parseInt(values.position.y, 0)) }
                if (!_.isUndefined(values.size) && !_.isUndefined(values.size.width)) { $(self.el).css('width', parseInt(values.size.width, 0)) }
                if (!_.isUndefined(values.size) && !_.isUndefined(values.size.height)) { $(self.el).css('height', parseInt(values.size.height, 0)) }
                // options style 은 타겟을 찾아서 설정 ex) target-bgColor
                if (!_.isUndefined(values.options) && !_.isUndefined(values.options.bgColor)) { $(self.el).find('.target-bgColor').css('background-color', values.options.bgColor) }
                if (!_.isUndefined(values.options) && !_.isUndefined(values.options.opacity)) { $(self.el).find('.target-opacity').css('opacity', parseFloat(values.options.opacity)) }
                if (!_.isUndefined(values.options) && !_.isUndefined(values.options.fontColor)) { $(self.el).find('.target-fontColor').css('color', values.options.fontColor) }

                self.updateLayoutData()
            }

            function layoutChangeComponent (e, params) {
                if (_.isArray(params)) {
                    _.forEach(params, function (item) {
                        if(self.isCurrentComponent(item.id)) {
                            changeCssComponent(item)
                        }
                    })
                } else if (_.isObject(params) && params.id) {
                    if(self.isCurrentComponent(params.id)) {
                        changeCssComponent(params)
                    }
                }
            }

            $rootScope.$on('layoutChangeComponent', layoutChangeComponent)
            $rootScope.$on('changeProperty', layoutChangeComponent)
        }

        Component.prototype.onSelectionChange = function () {
            var self = this
            $rootScope.$on('selectComponent', function (e, selectedId) {
                if (!self.isCurrentComponent(selectedId)) {
                    self.selectAreaShow(false)
                    self.handlerShow(false)
                }
            })
        }

        Component.prototype.selectAreaShow = function (show) {
            var self = this
            self.get('selectArea').css('display', (show === true) ? 'block':'none')
        }

        Component.prototype.handlerShow = function (show) {
            var self = this
            $(self.el).find('.resize-handler').css('display', (show === true) ? 'block':'none')
        }

        Component.prototype.link = function () {
            console.log()
        }

        Component.prototype.set = function (name, value) {
            this._attr[name] = value
        }

        Component.prototype.get = function (name) {
            if (_.isUndefined(name)) {
                return
            }
            return this._attr[name]
        }

        Component.prototype.isCurrentComponent = function (id) {
            return this.id === id
        }

        Component.prototype.destroy = function () {
            // TODO: 삭제
            $(this.el).off('click')
            $(this.el).remove()
            this.get('selectArea').remove()
        }

        return Component

    }
})