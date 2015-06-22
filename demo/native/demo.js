/* global MouseWheel */
;(function (win, dom, u) {
	
	/**
	 * Wait for window load event
	 */
	win.onload = function () {
		var canvas = dom.getElementById('canvas');
		var mw = new MouseWheel(canvas);
		
		
		//Listen for scroll events on this element
		mw.onRoll(function (event) {
			log(event);
		});
	};
	
	function log(event) {
		var p = dom.createElement('p');
			p.innerHTML = JSON.stringify(event);
		var log = dom.getElementById('log'); 
		log.appendChild(p);
		log.scrollTop = log.scrollHeight;
	}
})(window, document, void 0);