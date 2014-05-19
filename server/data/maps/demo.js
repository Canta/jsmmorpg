require("../../class/Map");
require("../landscape/DemoBoxes");
var OIMO = require("../../class/lib/Oimo.js");

module.exports = DemoMap = Map.extend({
	width  : 1000000,
	height : 100000,
	depth  : 1000000,
	name   : "DemoMap",
	statics: [],
	mobiles: [],
	npcs   : [],
	mobs   : [],
	
	init   : function(){
		var world = this;
		world.clear();
		var ground  = new OIMO.Body({size:[this.width, 40, this.depth], pos:[0,-20,0], world:world});
		
		for (var i = 0; i < 50; i++){
			var bola    = new OIMO.Body({type:'sphere', size:[10*0.5], pos:[Math.random() * 100,Math.random() * 100,Math.random() * 100], move:true, world:world});
			this.mobiles.push(bola);
		}
		
		this.statics.push(ground);
		
		this._super();
	}
});
