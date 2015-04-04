'use strict'

define(function (require) {

	// @ngInject
	return function theHelper () {
		return {
			debugger: {
				debuggerUse: false,
				debuggerModeOn: function(debuggerUse) {
					//debugger setting
					this.debuggerUse = debuggerUse
				},
				console: function(message) {

					if(this.debuggerUse) {
						$.each(arguments, function(i) {
							if(i > 0) {
								console.log(message, this)
							}

						})

					}
				}
			},
			/*
			 * Function: registerNamespace
			 */
			registerNamespace: function () {

				var args = arguments, obj = null, i, j, ns, nsParts, root
				for (i = 0; i < args.length; i++) {
					ns = args[i];
					nsParts = ns.split(".");
					root = nsParts[0];
					if (typeof window[root] === "undefined"){
						window[root] = {};
					}
					obj = window[root];
					//eval('if (typeof ' + root + ' == "undefined"){' + root + ' = {};} obj = ' + root + ';');
					for (j = 1; j < nsParts.length; ++j) {
						obj[nsParts[j]] = obj[nsParts[j]] || {};
						obj = obj[nsParts[j]];
					}
				}
			},

			/* 실수를 지정한 소수점 이하에서 반올림 */
			roundXL: function(n, digits){
				if(digits >= 0) {
					return parseFloat(n.toFixed(digits));
				}
				digits = Math.pow(10,digits);
				var t = Math.round(n*digits)/digits;
				return parseFloat(t.toFixed(0));
			},

			/*
			 * Function: coalesce
			 * Takes any number of arguments and returns the first non Null / Undefined argument.
			 */
			coalesce: function () {
				var i;
				for (i = 0; i < arguments.length; i++) {
					if (!this.isNothing(arguments[i])) {
						return arguments[i];
					}
				}
				return null;
			},

			/*
			 * Function: extend
			 */
			extend: function(destination, source, overwriteProperties){
				var prop;
				if (this.isNothing(overwriteProperties)){
					overwriteProperties = true;
				}
				if (destination && source && this.isObject(source)){
					for(prop in source){
						if (this.objectHasProperty(source, prop)) {
							if (overwriteProperties){
								destination[prop] = source[prop];
							}
							else{
								if(typeof destination[prop] === "undefined"){
									destination[prop] = source[prop];
								}
							}
						}
					}
				}
			},

			/*
			 * Function: clone
			 */
			clone: function(obj) {
				var retval = {};
				this.extend(retval, obj);
				return retval;
			},

			/*
			 *  Parse Boolean to String
			 */
			parseBoolean: function(str){
				return /true/i.test(str);
			},


			/*
			 * Function: swapArrayElements
			 */
			swapArrayElements: function(arr, i, j){

				var temp = arr[i];
				arr[i] = arr[j];
				arr[j] = temp;

			},

			/*
			 * Function: trim
			 */
			trim: function(val) {
				return val.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			},

			/*
			 * Function: toCamelCase
			 */
			toCamelCase: function(val){
				return val.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
			},

			/*
			 * Function: toDashedCase
			 */
			toDashedCase: function(val){
				return val.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
			},

			/*
			 * Function: objectHasProperty
			 */
			objectHasProperty: function(obj, propName){

				if (obj.hasOwnProperty){
					return obj.hasOwnProperty(propName);
				}
				else{
					return ('undefined' !== typeof obj[propName]);
				}

			},
			/*  */
			stringToClass: function(str) {

				var arr = str.split(".");
				var fn = (window || this);

				for (var i = 0, len = arr.length; i < len; i++) {
					fn = fn[arr[i]];
				}

				if (typeof fn !== "function") {
					throw new Error("function not found");
				}

				arr = null;

				return  fn;
			},

			/* QueryString.*/
			querystring: function() {
				var querystring = location.search.replace( '?', '' ).split( '&' );
				if ( querystring === '') {
					return null;
				}

				var queryObj = {};

				for ( var i=0; i<querystring.length; i++ ) {
					var name = querystring[i].split('=')[0];
					var value = querystring[i].split('=')[1];
					queryObj[name] = value;
				}
				return queryObj;
			},

			// 반올림
			math : {
				round : function(num,ja){
					ja = Math.pow(10,ja);
					return Math.round(num*ja)/ja;
				},

				// 올림
				ceil : function(num, ja){
					ja = Math.pow(10, ja);
					return Math.ceil(num*ja)/ja;
				},

				// 내림
				floor : function(num, ja){
					ja = Math.pow(10, ja);
					return Math.floor(num*ja)/ja;
				},

				// unique random
				shuffleRandom : function(n){
					var ar = [];
					var temp;
					var rnum;

					for(var i=1; i<=n; i++){
						ar.push(i);
					}

					for(var t=0; t<ar.length; t++){
						rnum = Math.floor(Math.random() * n);
						temp = ar[t];
						ar[t] = ar[rnum];
						ar[rnum] = temp;
					}

					return ar;
				},

				randomRange : function(min, max){
					return Math.floor((Math.random()* (max - min + 1)) + min);
				}
			},
			string : {
				varSpaceRemove : function (val){
					var resultStr = ""; //반환해주는 결과값
					for (var i = 0; i < val.length; i = i + 1 ){
						var tmpStr = val.charAt(i);
						if (tmpStr === " "){
							tmpStr = "";
						}
						resultStr += tmpStr;
					}
					return resultStr;
				}
			},
			uiEvent : {
				EventType : {},
				currentEventTypeSelector : function(){
					if("ontouchstart" in window){
						this.EventType.mousedownEvent = 'touchstart';
						this.EventType.mouseenterEvent = 'touchmove';
						this.EventType.mouseleaveEvent = 'touchend';
					}else{
						this.EventType.mousedownEvent = 'mousedown';
						this.EventType.mouseenterEvent = 'mouseenter';
						this.EventType.mouseleaveEvent = 'mouseleave';
						this.EventType.mouseoverEvent = 'mouseover';
						this.EventType.mouseoutEvent = 'mouseout';
					}
				},
				/* 추가 -event분기 */
				addEvent: function(evnt, elem, func) {
					if (elem.addEventListener){  // W3C DOM
						//console.log('addEventListener');
						elem.addEventListener(evnt,func,false);
					}else if (elem.attachEvent) { // IE DOM
						elem.attachEvent("on"+evnt, func);
					}
					else { // No much to do
						elem[evnt] = func;
					}
				},

				/*
				 * Function: add
				 * Add an event handler
				 */
				add: function(obj, type, handler){
					$(obj).bind(type, handler);
				},

				/*
				 * Function: remove
				 * Removes a handler or all handlers associated with a type
				 */
				remove: function(obj, type, handler){
					$(obj).unbind(type, handler);
				},

				/*
				 * Function: fire
				 * Fire an event
				 */
				fire: function(obj, type){
					var event,
						args = Array.prototype.slice.call(arguments).splice(2);

					if (typeof type === "string"){
						event = { type: type };

					}
					else{
						event = type;
					}

					$(obj).trigger( $.Event(event.type, event),  args);
				},


				/*
				 * Function: getMousePosition
				 */
				getMousePosition: function(event){

					var retval = {
						x: event.pageX,
						y: event.pageY
					};

					return retval;

				},


				/*
				 * Function: getTouchEvent
				 */
				getTouchEvent: function(event){

					return event.originalEvent;

				},


				/*
				 * Function: getWheelDelta
				 */
				getWheelDelta: function(event){

					var delta = 0;
					if (!_.isUndefined(event.wheelDelta)){
						delta = event.wheelDelta / 120;
					}
					else if (!_.isUndefined(event.detail)){
						delta = -event.detail / 3;
					}
					return delta;

				},

				/*
				 * Function: domReady
				 */
				domReady: function(handler){

					$(document).ready(handler);

				},

				/*
				 * Function :  makeMouseEvent
				 */
				makeMouseEvent:function(event) {
					var isTouch = $.isTouch;
					var touch = (isTouch)? event.originalEvent.changedTouches[0] : event.originalEvent;
					return $.extend(event, {
						type:    event.type,
						which:   1,
						pageX:   touch.pageX,
						pageY:   touch.pageY,
						screenX: touch.screenX,
						screenY: touch.screenY,
						clientX: touch.clientX,
						clientY: touch.clientY,
						isTouchEvent: isTouch
					});
				}
			},
			// get window
			win: {
				getWidth: function() {
					return $(window).width();
				},
				getHeight: function() {
					return $(window).height();
				}
			},
			// is
			is: {
				isChrome: function() {
					return navigator.userAgent.indexOf('Chrome') !== -1;
				},
				/*
				 * Function: isObject
				 */
				isObject: function(obj){
					return obj instanceof Object;
				},

				/*
				 * Function: isFunction
				 */
				isFunction: function(obj){
					return ({}).toString.call(obj) === "[object Function]";
				},

				/*
				 * Function: isArray
				 */
				isArray: function(obj){
					return obj instanceof Array;
				},

				/*
				 * Function: isLikeArray
				 */
				isLikeArray: function(obj) {
					return typeof obj.length === 'number';
				},

				/*
				 * Function: isNumber
				 */
				isNumber: function(obj){
					return typeof obj === "number";
				},

				/*
				 * Function: isString
				 */
				isString: function(obj){
					return typeof obj === "string";
				},

				/*
				 * Function: isNothing
				 */
				isNothing: function (obj) {
					if (typeof obj === "undefined" || obj === null || obj === []) {
						return true;
					}
					return false;
				},

				/* 추가 */
				isCssTransforms: function(){
					if(Modernizr.csstransforms){
						return true;
					}
					return false;
				},

				/* imMobile */
				isMobile : function() { //sniff a mobile browser

					if( navigator.userAgent.match(/Android/i) ||
						navigator.userAgent.match(/webOS/i) ||
						navigator.userAgent.match(/iPad/i) ||
						navigator.userAgent.match(/iPhone/i) ||
						navigator.userAgent.match(/iPod/i)||
						navigator.userAgent.match(/mobile/i)
					){
						return true;
					}

					return false;
				},
				/* is IOS */
				isIOS : function() {    //sniff a mobile browser

					if( navigator.userAgent.match(/iPad/i) ||
						navigator.userAgent.match(/iPhone/i) ||
						navigator.userAgent.match(/iPod/i)
					){
						return true;
					}

					return false;
				},
				isIPad : function() {
					if( navigator.userAgent.match(/iPad/i)){
						return true;
					}

					return false;
				},
				isAndroid : function() {
					if( navigator.userAgent.match(/Android/i)){
						return true;
					}

					return false;
				},
				isAndroidTab : function() {
					if( navigator.userAgent.match(/SHV-E150S/)||
						navigator.userAgent.match(/SHW-M180S/)||
						navigator.userAgent.match(/SHV-E140S/)||
						navigator.userAgent.match(/SHW-M380S/)
					){
						return true;
					}

					return false;
				},
				isMozilla : function() {
					if( navigator.userAgent.match(/Mozilla/i)){
						return true;
					}

					return false;
				},
				isWide: function() {
					var orientation = window.orientation,
						winWidth = $(window).width(),
						winHeight = $(window).height();

					if(orientation === 0 || orientation === 180) {
						//세로
						return (winWidth > winHeight)? true : false;
					}else if(orientation === 90 || orientation === -90){
						//가로
						return (winHeight > winWidth)? false : true;
					}else{
						return true;
					}
				}
			},
			Browser: {
				ua: null,
				version: null,
				webkit: null,
				opera: null,
				msie: null,
				chrome: null,
				mozilla: null,

				android: null,
				blackberry: null,
				iPad: null,
				iPhone: null,
				iOS: null,

				isTouchSupported: null,
				isGestureSupported: null,

				_detect: function() {
					this.ua = window.navigator.userAgent;
					this.version = (this.ua.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || []);
					this.webkit = /webkit/i.test(this.ua);
					this.opera = /opera/i.test(this.ua);
					this.msie = /msie/i.test(this.ua) && !this.opera;
					this.chrome = /Chrome/i.test(this.ua);
					this.mozilla = /mozilla/i.test(this.ua) && !/(compatible|webkit)/.test(this.ua);
					this.android = /android/i.test(this.ua);
					this.blackberry = /blackberry/i.test(this.ua);
					this.iPad = /(iPad).*OS\s([\d_]+)/.test(this.ua);
					this.iPhone = !this.ipad && /(iPhone\sOS)\s([\d_]+)/.test(this.ua);
					this.iOS = this.iPad || this.iPhone;

					this.isTouchSupported = this.isEventSupported('touchstart');
					this.isGestureSupported = this.isEventSupported('gesturestart');
				},
				_eventTagNames: {
					'select':'input',
					'change':'input',
					'submit':'form',
					'reset':'form',
					'error':'img',
					'load':'img',
					'abort':'img'
				},
				/*
				 * Function: isEventSupported
				 * http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
				 */
				isEventSupported: function(eventName) {
					var el = document.createElement(this._eventTagNames[eventName] || 'div'),
						isSupported
					eventName = 'on' + eventName
					isSupported = el.hasOwnProperty(eventName)
					if (!isSupported) {
						el.setAttribute(eventName, 'return')
						isSupported = typeof el[eventName] === 'function'
					}
					el = null
					return isSupported
				}
			},
			initialize: function() {
				//this.uiEvent.currentEventTypeSelector()
				this.Browser._detect()
			}
		}
	}
})
