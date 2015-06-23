;(function (win, dom, u) {
	
	/**
	 * Load dependencies [OutputWheelEvent]
	 */
	 var OutputWheelEvent 	= require('./OutputWheelEvent');
	 var Events = require('events');
	
	/**
	 * This class attach mouse wheel events over targetElement which is passed as parameter to the constructor
	 * @param {HTMLElement} targetElement - this is the element which you want to track mouse wheel event
	 * 
	 * @returns {undefined}
	 */
	var MouseWheelHandler = function (targetElement) {
		this.$$target    	= targetElement;
		
		this.lastTime    	= null;
		this.lastDirection	= 0;
		this.$$attachEvents();
		this.$$eventEmitter = new Events.EventEmitter();
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
			this.$$eventEmitter.removeAllListeners();
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
		return this.$$fire(output);
	};
	
	/**
	 * @private
	 */
	MouseWheelHandler.prototype.$$fire = function (output) {
		switch(output.direction) {
			case OutputWheelEvent.DIRECTION_UP :
				this.$$eventEmitter.emit(OutputWheelEvent.EVENT_UP, output);
				break;
			case OutputWheelEvent.DIRECTION_DOWN :
				this.$$eventEmitter.emit(OutputWheelEvent.EVENT_DOWN, output);
				break;
		}
		
		this.$$eventEmitter.emit(OutputWheelEvent.EVENT_NAME, output);
		
		return this;
	};
	
	MouseWheelHandler.prototype.on = function (name, callback) {
		if(isFunction(callback)) {
			this.$$eventEmitter.on(name, callback);
		}
		
		return this;
	};
	
	MouseWheelHandler.prototype.off = function (name, callback) {
		this.$$eventEmitter.removeListener(name, callback);
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