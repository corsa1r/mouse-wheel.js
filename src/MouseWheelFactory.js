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