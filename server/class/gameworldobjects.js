
var utils = require("./utils");

module.exports = GameWorldObjects = (function(){
	var GWO = {};
	
	GWO.ImmaterialObject = utils.EventEmitter.extend({
		/* properties first */
		width : 0,
		height: 0,
		depth : 0,
		weight: 0,
		coords: {
			x: 0,
			y: 0,
			z: 0
		},
		
		init : function(specs){
			for (s in specs){
				this[s] = specs[s];
			}
			return this;
		}
	});
	
	GWO.SolidObject = GWO.ImmaterialObject.extend({});
	
	GWO.StaticObject = GWO.SolidObject.extend({});
	
	GWO.MobileObject = GWO.StaticObject.extend({
		
		move : function(to){
			if (to instanceof Array || to instanceof Object){
				this.coords.x = (to[x]) ? to[x] : this.coords.x;
				this.coords.y = (to[y]) ? to[y] : this.coords.y;
				this.coords.z = (to[z]) ? to[z] : this.coords.z;
			}
		}
	});
	
	
	return GWO;
})();
