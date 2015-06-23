/* global angular */
module.exports = ['$parse', '$mouseWheel', function ($parse, $mouseWheel) {
	return {
		restrict : 'A',
		link: function (scope, element, attributes) {
			var target = element[0];
			var mwHandler = new $mouseWheel(target);
			var callbackName = attributes.mwRoll;
			var callback = scope[callbackName];
			
			if(!angular.isUndefined(callback) && angular.isFunction(callback)) {//attach event listener only if the callback name exists and is a function
				mwHandler.onRoll(function ($event) {
					callback.apply(callback, [$event, element]);
				});
			}
			
			scope.$on('$destroy', function () {
				mwHandler.destory();//clean up callback reference before garbage collector
			});
		}
	};
}];