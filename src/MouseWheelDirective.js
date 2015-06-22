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