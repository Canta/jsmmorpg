
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
	
	GWO.MovableObject = GWO.StaticObject.extend({});
	
	
	return GWO;
})();
