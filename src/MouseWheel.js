/**
 * This file is build entry for Browserify
 */
;(function (win, dom, u) {
	
	var TYPE_FUNCTION 	= 'function';
	var CLASSNAME		= 'MouseWheel';
	var MouseWheel 		= require('./MouseWheelHandler');
	
	/**
	 * Define module as
	 */
	 
	if (typeof define == TYPE_FUNCTION && define.amd) {//AMD
	    define([], function() {
	        return MouseWheel;
	    });
	} else if (typeof module != 'undefined' && module.exports) {//COMMON
	    module.exports = MouseWheel;
	}
	
	if(win) {//define as global variable
	    win[CLASSNAME] = MouseWheel;
	}
})(window, document, void 0);