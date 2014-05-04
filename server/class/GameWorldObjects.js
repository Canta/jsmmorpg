
var utils = require("./Utils");
require("./GeoStuff");

function GameWorldObject(){
	this.width    = 0;
	this.height   = 0;
	this.depth    = 0;
	this.weight   = 0;
	this.position = new GeoStuff.Point3D(0,0,0);
	
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
	
	this.__timers = {"moving" : null};
	this.__destination = null;
	
	this.is_moving = function(){
		return !(this.__timers.moving === null);
	}
	
	this.move = function(to){
		if (to instanceof GeoStuff.Point3D){
			this.__destination = to;
			
			var tmp = function(){
				if (this.position.in_range( this.__destination ) ){
					this.stop();
				} else {
					this.__move(5);
				}
			}
			
			this.__timers.moving = setTimeout(tmp,100);
			
		} else {
			throw new Error("GameWorldObjects.MobileObject.move: Point3D expected.");
		}
	}
	
	this.__move = function(step){
		this.position.x += step;
		this.position.y += step;
		this.position.z += step;
	}
	
	this.stop = function(){
		clearInterval(this.__timers.moving);
		this.__timers.moving = null;
	}
	
	
	return SolidObject.extend(this);
}


module.exports = GameWorldObjects = {
	GameWorldObject: GameWorldObject(),
	ImmaterialObject: ImmaterialObject(),
	SolidObject: SolidObject(),
	StaticObject: StaticObject(),
	MobileObject: MobileObject()
};
