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