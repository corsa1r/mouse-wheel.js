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
	
    module.exports = OutputWheelEvent;
})(window, document, void 0);