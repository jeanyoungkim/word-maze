"use strict";

// Shareable Analytics object for Games prototypes

var Analytics = {
	// Define name of prototype during initialization. Ex:  Analytics.defineGame('spelling-bee')
	defineGame: function defineGame(name) {
		this.gameName = name;
	},
	// Use push in the callback for event listeners and pass in 1. the element name and 2. optional progress object
	push: function push(element) {
		var progress = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		dataLayer.push({
			"event": "moduleInteraction",
			"interaction": {
				"module": {
					"name": "games-prototype-" + this.gameName,
					"element": {
						"name": element
					},
					"progress": progress
				},
				"type": element,
			}
		});
	}
};
