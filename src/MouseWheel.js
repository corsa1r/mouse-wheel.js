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
			.factory('$mouseWheel', require('./MouseWheelFactory'))
			.directive('mwRoll', require('./MouseWheelDirective'));
	}
})(window, document, void 0);