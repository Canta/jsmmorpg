var utils = require("./Utils");
var OIMO = require("./lib/Oimo.js");

OimoWorld = utils.EventEmitter.extend(new OIMO.World());


module.exports = Map = OimoWorld.extend({
	name     : "empty map",
	width    : 0,
	height   : 0,
	depth    : 0,
	statics  : [],
	mobiles  : [],
	npcs     : [],
	mobs     : [],
	interval : 0,
	init : function(specs){
		for (s in specs){
			this[s] = specs[s];
		}
		return this;
	},
	
	start : function(){
		var self = this;
		var tmp = function(){
			self.step();
		}
		this.interval = setInterval(tmp,9);
	},
	
	stop : function(){
		clearInterval( this.interval );
		this.interval = 0;
	}
	
});
