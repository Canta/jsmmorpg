
var utils = require("./Utils");
require("./GeoStuff");

function GameWorldObject(){
	this.width = 0;
	this.height= 0;
	this.depth = 0;
	this.weight= 0;
	this.coords= {
		x: 0,
		y: 0,
		z: 0
	};
	
	this.init = function(specs){
		for (s in specs){
			this[s] = specs[s];
		}
		return this;
	}
	
	return GeoStuff.AABB.extend(this);
};

function ImmaterialObject(){
	return GameWorldObject.extend(this);
}

function SolidObject(){ 
	
	return ImmaterialObject.extend(this);
}
	
function StaticObject(){ 
	return SolidObject.extend(this);
}

function MobileObject(){ 
	this.move = function(to){
		if (to instanceof Array || to instanceof Object){
			this.coords.x = (to[x]) ? to[x] : this.coords.x;
			this.coords.y = (to[y]) ? to[y] : this.coords.y;
			this.coords.z = (to[z]) ? to[z] : this.coords.z;
		}
	}
	
	return StaticObject.extend(this);
}


module.exports = GameWorldObjects = {
	GameWorldObject: GameWorldObject(),
	ImmaterialObject: ImmaterialObject(),
	SolidObject: SolidObject(),
	StaticObject: StaticObject(),
	MobileObject: MobileObject()
};
