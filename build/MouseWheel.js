(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
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
},{"./MouseWheelDirective":3,"./MouseWheelFactory":4,"./MouseWheelHandler":5}],3:[function(require,module,exports){
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
},{"./OutputWheelEvent":6}],4:[function(require,module,exports){
/**
 * Load dependency
 */
var MouseWheel = require('./MouseWheelHandler');

/**
 * define $mouseWheel factory
 */
module.exports = [function () {
	return MouseWheel;
}];
},{"./MouseWheelHandler":5}],5:[function(require,module,exports){
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
},{"./OutputWheelEvent":6,"events":1}],6:[function(require,module,exports){
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
	OutputWheelEvent.EVENT_UP	= 'roll.up';
	OutputWheelEvent.EVENT_DOWN	= 'roll.down';
	OutputWheelEvent.EVENT_NAME	= 'roll';
	
    module.exports = OutputWheelEvent;
})(window, document, void 0);
},{}]},{},[2]);
