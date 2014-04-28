var utils = require("./Utils");

module.exports = Map = utils.EventEmitter.extend({
	name    : "empty map",
	width   : 0,
	height  : 0,
	depth   : 0,
	statics : [],
	mobiles : [],
	npcs    : [],
	mobs    : [],
	init : function(specs){
		for (s in specs){
			this[s] = specs[s];
		}
		return this;
	}
});
