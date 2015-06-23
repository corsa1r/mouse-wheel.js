/* global angular */

var OutputWheelEvent = require('./OutputWheelEvent');

module.exports = ['$parse', '$mouseWheel', function ($parse, $mouseWheel) {
	return {
		restrict : 'A',
		link: function (scope, element, attributes) {
			var target = element[0];
			var mwHandler = new $mouseWheel(target);
			var callbackName = attributes.mwRoll;
			var callback = scope[callbackName];
			var eventName = OutputWheelEvent.EVENT_NAME;
			
			switch(attributes.mwDirection) {
				case OutputWheelEvent.EVENT_UP :
					eventName = OutputWheelEvent.EVENT_UP;
					break;
				case OutputWheelEvent.EVENT_DOWN :
					eventName = OutputWheelEvent.EVENT_DOWN;
					break;
			}
			
			if(!angular.isUndefined(callback) && angular.isFunction(callback)) {//attach event listener only if the callback name exists and is a function
				mwHandler.on(eventName, function ($event) {
					callback.apply(callback, [$event, element]);
				});
			}
			
			scope.$on('$destroy', function () {
				mwHandler.destory();//clean up callback reference before garbage collector
			});
		}
	};
}];