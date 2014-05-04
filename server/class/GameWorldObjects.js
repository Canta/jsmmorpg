
var utils = require("./Utils");
require("./GeoStuff");

function GameWorldObject(){
	
	this.init = function(specs){
		this.width    = 0;
		this.height   = 0;
		this.depth    = 0;
		this.weight   = 0;
		this.position = new GeoStuff.Point3D(0,0,0);
		this.radius   = 5;
		
		for (s in specs){
			this[s] = specs[s];
		}
		
		this._super(this.position,this.radius);
		
		return this;
	}
	
	return new (GeoStuff.AABB.extend(this))();
};

function ImmaterialObject(){
	return new (GameWorldObject.extend(this))();
}

function SolidObject(){ 
	
	return new (ImmaterialObject.extend(this))();
}
	
function StaticObject(){ 
	return new (SolidObject.extend(this))();
}

function MobileObject(){
	
	this.__timers      = {"moving" : null};
	this.__counters    = {"moving" : 0};
	this.__status      = {"can_move" : true};
	this.__destination = null;
	this.center        = new GeoStuff.Point3D();
	this.radius        = 0;
	this.moving_step   = {x:5, y:5, z:5};
	
	this.is_moving = function(){
		return !(this.__timers.moving === null);
	}
	
	this.can_move = function(){
		return this.__status.can_move === true;
	}
	
	this.move = function(to, duration){
		
		if (isNaN(parseInt(duration))){
			throw new Error("GameWorldObjects.MobileObject.move: numeric duration expected.");
		}
		
		if (to instanceof GeoStuff.Point3D){
			this.__destination = to;
			
			this.moving_step.x = Math.floor((to.x - this.center.x) * 100 / duration);
			this.moving_step.y = Math.floor((to.y - this.center.y) * 100 / duration);
			this.moving_step.z = Math.floor((to.z - this.center.z) * 100 / duration);
			this.__counters.moving = duration;
			
			utils.debug("starting to move, from " + this.center.to_string() + " to " + this.__destination.to_string());
			this.emit("start_move",this);
			var self = this;
			var tmp = function(){
				if (self.can_move()){
					if (self.__counters.moving <= 0){
						self.__counters.moving = 0;
						utils.debug("reached " + self.center.to_string() + ". Stopping.");
						self.stop();
					} else {
						utils.debug("moving from " + self.center.to_string() + " + " + JSON.stringify(self.moving_step));
						self.__move(self.moving_step.x, self.moving_step.y, self.moving_step.z);
						self.__counters.moving -= 100;
					}
				}
			}
			
			this.__timers.moving = setInterval(tmp,100);
			
		} else {
			throw new Error("GameWorldObjects.MobileObject.move: Point3D expected.");
		}
	}
	
	this.__move = function(x,y,z){
		this.center.x += x;
		this.center.y += y;
		this.center.z += z;
	}
	
	this.stop = function(){
		clearInterval(this.__timers.moving);
		this.__timers.moving = null;
		utils.debug("movement stopped");
		this.emit("stop",this);
	}
	
	
	return SolidObject.extend(this);
}


module.exports = GameWorldObjects = {
	GameWorldObject: GameWorldObject,
	ImmaterialObject: ImmaterialObject(),
	SolidObject: SolidObject(),
	StaticObject: StaticObject(),
	MobileObject: MobileObject()
};
