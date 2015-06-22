(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global angular */
/* global define */
/**
 * This file is build entry for Browserify
 */
;(function (win, dom, u) {
	
	var TYPE_FUNCTION 	= 'function';
	var TYPE_OBJECT 	= 'object';
	var CLASSNAME		= 'MouseWheel';
	var MouseWheel 		= require('./MouseWheelHandler');
	
	/**
	 * Define module as
	 */
	 
	if (typeof define === TYPE_FUNCTION && define.amd) {//AMD
	    define([], function() {
	        return MouseWheel;
	    });
	} else if (typeof module != 'undefined' && module.exports) {//COMMON
	    module.exports = MouseWheel;
	}
	
	if(win) {//define as global variable
	    win[CLASSNAME] = MouseWheel;
	}
	
	if(typeof angular === TYPE_OBJECT) {
		angular.module('mouseWheel', [])
			.directive('onRoll', require('./MouseWheelDirective'));
	}
})(window, document, void 0);
},{"./MouseWheelDirective":2,"./MouseWheelHandler":3}],2:[function(require,module,exports){
/* global angular */
var MouseWheel = require('./MouseWheel');

module.exports = ['$parse', function ($parse) {
	return {
		restrict : 'A',
		link: function (scope, element, attributes) {
			var target = element[0];
			var mw = new MouseWheel(target);
			var callbackName = attributes.onRoll;
			var callback = scope[callbackName];
			
			if(!angular.isUndefined(callback) && angular.isFunction(callback)) {//attach event only if the callback name exists and is a function
				mw.onRoll(function ($event) {
					callback.apply(callback, [$event, element]);
				});	
			}
			
			scope.$on('$destroy', function (params) {
				mw.$$callbacks = [];//cleaning up callbacks
			});
		}
	};
}];
},{"./MouseWheel":1}],3:[function(require,module,exports){
;(function (win, dom, u) {
	
	/**
	 * Load dependencies [OutputWheelEvent]
	 */
	 var OutputWheelEvent = require('./OutputWheelEvent');
	
	/**
	 * This class attach mouse wheel events over targetElement which is passed as parameter to the constructor
	 * @param {HTMLElement} targetElement - this is the element which you want to track mouse wheel event
	 * 
	 * @returns {undefined}
	 */
	var MouseWheelHandler = function (targetElement) {
		this.$$target = targetElement;
		this.$$callbacks = [];
		
		this.lastTime = null;
		this.lastDirection = 0;
		this.$$attachEvents();
	};
	
	/**
	 * @private
	 */
	MouseWheelHandler.prototype.$$attachEvents = function () {
		this.$$target.addEventListener("mousewheel", this.$$handler.bind(this), false);
	};
	
	/**
	 * @private
	 */
	MouseWheelHandler.prototype.$$handler = function (event) {
		event = window.event || event; // old IE support
		
		var now = Date.now();
		
		if(!this.lastTime) {
			this.lastTime = now;
		}
		
		var deltaTime = now - this.lastTime;
		var deltaDirection = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
		var isNew = Boolean((deltaTime > OutputWheelEvent.CLEAR_TIME) || deltaTime === 0 || deltaDirection !== this.lastDirection);
		var output = new OutputWheelEvent(deltaDirection, deltaTime, isNew);
		this.lastTime = now;
		this.lastDirection = deltaDirection;
		
		for(var i in this.$$callbacks) {
			this.$$callbacks[i](output);
		}
	};
	
	/**
	 * This method allows you to attach listeners for mouse wheel events
	 * return {Object} self instance
	 */
	MouseWheelHandler.prototype.onRoll = function (callback) {
		this.$$callbacks.push(callback);
		return this;
	};
	
	/**
	 * Little ECMA fix
	 * add Date.now function into native Date object if not exists
	 */
	if(!Date.now) {
		Date.now = function now() {
			return (new Date()).getTime();
		}
	}
	
	module.exports = MouseWheelHandler;
})(window, document, void 0);
},{"./OutputWheelEvent":4}],4:[function(require,module,exports){
/* global define */
;(function (win, dom, u) {	
	/**
	 * This class implements output event for MouseWheel
	 * @param {Number} direction - this is the direction comes from MouseWheelHandler
	 * @see -1 is DOWN 1 is UP direction
	 * 
	 * @param {Number} deltaTime this is delta between events
	 * @param {Boolean} isNew - this marker is set to true if the event is new or the direction is different from the last one.
	 * 
	 * @returns {undefined} - instance of this class
	 */
	var OutputWheelEvent = function (direction, deltaTime, isNew) {
		this.direction = OutputWheelEvent.DIRECTIONS[direction + 1];
		this.time = Date.now();
		this.isNew = isNew;
		this.delta = this.isNew ? 0 : deltaTime;//dont show the old delta
	};
	
	/**
	 * @static
	 */
	OutputWheelEvent.DIRECTION_UP 	= 'up';
	OutputWheelEvent.DIRECTION_DOWN = 'down';
	OutputWheelEvent.DIRECTIONS = {
		2 : OutputWheelEvent.DIRECTION_UP,
		0 : OutputWheelEvent.DIRECTION_DOWN
	};
	OutputWheelEvent.CLEAR_TIME = 300;//this is delta time gap
	
    module.exports = OutputWheelEvent;
})(window, document, void 0);
},{}]},{},[1]);
