
var utils = require("./utils");

function Map(){
	this.width   = 0;
	this.height  = 0;
	this.depth   = 0;
	this.statics = [];
	this.mobiles = [];
	this.npcs    = [];
	this.mobs    = [];
	
	this.init = function(specs){
		for (s in specs){
			this[s] = specs[s];
		}
		return this;
	}
	
	return utils.EventEmitter.extend(this);
};

module.exports = Map = Map();
