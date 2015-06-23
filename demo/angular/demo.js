/* global angular */
var app = angular.module('App', ['mouseWheel'])//define our angular application which depends on mouseWheel module.
	.controller('MainController', ['$scope', '$mouseWheel', function($scope, $mouseWheel) {
		
		var myElement = document.getElementById('myElement');
		var mwHandler = new $mouseWheel(myElement);
		
		mwHandler.on('roll', function ($event) {
			$scope.onRoll($event, [myElement]);
		});
		
		//List of fruits for repeat
		$scope.fruits 	= ['Apple', 'Banana', 'Melon', 'Orange', 'Lemon'];
		$scope.dirs 	= ['roll.up', 'roll.up', 'roll', 'roll.down', 'roll.down'];
		
		/**
		 * This is event listener for MouseWheel directive
		 * <div on-roll="onRoll"></div>
		 * 	on-roll attribute is a Angular directive, 
	 	 *  onRoll string inside this attribute is a name of the callback defined in the $scope
		 */
		$scope.onRoll = function ($event, $target) {
			$scope.zoomInElement($target, $event.direction === 'down', 10 / $event.delta);
		};
		
		/**
		 * This method resizes the target element
		 * @param {Object} element - this is the element which you scroll over
		 * @param {Boolean} reverse - this depends on direction of scroll
		 * @param {Number} acceleration - this depends on speed (using delta) of scrolling
		 */
		$scope.zoomInElement = function (element, reverse, acceleration) {
			var step = 2;
			var trueAcceleration = acceleration === Infinity ? 0 : acceleration;
			var direction = reverse ? -1 : 1;
			var padding = element[0].style.padding;
			var paddingValue = padding ? parseFloat(padding, 10) : 0;
			var newPaddingValue = (paddingValue + (step * direction * trueAcceleration));
			var min = 0;
			var max = 100;
			var value = newPaddingValue < min ? min : newPaddingValue > max ? max : newPaddingValue;
			
			element[0].style.padding = value.toString() + 'px'; 
		};
	}]);