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
		this.$$callback = null;
		
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
	 * This method unbind event for mousewheel over $$target element
	 * @return undefined
	 */
	MouseWheelHandler.prototype.destroy = function () {
		if(this.$$target) {
			this.$$target.removeEventListener('mousewheel', this.$$handler.bind(this));
			this.$$callback = null;
			this.lastTime = null;
			this.lastDirection = 0;
		}
		
		return u;
	}
	
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
		this.$$fire(output);
	};
	
	/**
	 * @private
	 */
	MouseWheelHandler.prototype.$$fire = function (output) {
		if(isFunction(this.$$callback)) {
			this.$$callback(output);
		}
	};
	
	/**
	 * This method allows you to attach one listener for mouse wheel events
	 * return {Object} self instance
	 */
	MouseWheelHandler.prototype.onRoll = function (callback) {
		if(isFunction(callback)) {
			this.$$callback = callback;
		}
		
		return this;
	};
	
	/**
	 * Little ECMA fix
	 * add Date.now function into native Date object if not exists
	 */
	if(!Date.now) {
		Date.now = function now() {
			return (new Date()).getTime();
		};
	}
	
	/**
	 * This function checks if the given parameter is a callable function
	 * @param {Function} what
	 * @returns {Boolean} true if it's a function false otherwise
	 */
	function isFunction(what) {
		return Boolean(typeof what === 'function' || what instanceof Function);
	}
	
	module.exports = MouseWheelHandler;
})(window, document, void 0);