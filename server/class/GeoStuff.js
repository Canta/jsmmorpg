
var utils = require("./Utils");
var Map = require("./Map");

function Point3D(x,y,z){
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	
	return this;
}

var AABB = utils.EventEmitter.extend({
	//Axis Aligned Bounding Box
	points : [],
	center : null,
	radius : null,
	
	init : function(center, radius){
		//from and to are supossed to be points
		if (!(typeof center === "object" && center instanceof Point3D)){
			throw new Error("GeoStuff.AABB: Point3D expected.");
		}
		
		utils.debug("aabb: radius passed: " + radius);
		radius = parseFloat(radius);
		if ( isNaN(radius) || radius <= 0 ){
			throw new Error("GeoStuff.AABB: positive radius expected, "+radius+" given.");
		}
		
		this.points = [];
		this.center = center;
		this.radius = radius;
		utils.debug("aabb.init",center,radius);
		//Given a point in 3d space and a radius, we create a box.
		for (var i = 0; i < 8; i++){
			var x,y,z;
			z = (i & 4) ? center.z + radius : center.z - radius;
			y = (i & 2) ? center.y + radius : center.y - radius;
			x = (i & 1) ? center.x + radius : center.x - radius;
			
			utils.debug("aabb.point["+i+"]: " + x + "," + y + "," + z);
			this.points.push(new Point3D(x,y,z));
		}
		
		return this;
	}
});

function Area(){
	this.points = [];
	this.notify = function(callback){
		
	};
	
	return this;
}

var Octree = utils.EventEmitter.extend({
	max_depth      : 16,
	max_elements   : 3,
	root           : null,
	center         : null,
	radius         : null,
	
	get_area_nodes : function(point, radius){
		
	},
	
	init : function(mapa, specs){
		//utils.debug("init octree:", mapa, specs);
		if (!(typeof mapa === "object" && mapa instanceof Map)){
			throw new Error("GeoStuff.Octree: Map expected.");
		}
		
		if (specs !== undefined){
			for (s in specs){
				this[s] = specs[s];
			}
		}
		
		if (this.radius === null || isNaN(this.radius)){
			this.radius = mapa.depth / 2;
		}
		
		utils.debug("radius parsed: " + this.radius);
		
		this.parse_map(mapa);
		
	},
	
	parse_map : function(map){
		if (!(typeof map === "object" && map instanceof Map)){
			throw new Error("GeoStuff.Octree.parse_map: Map expected.");
		}
		
		var index_limit = isNaN(parseInt(this.max_depth)) ? 0 : parseInt(this.max_depth);
		
		if (index_limit <= 0){
			throw new Error("GeoStuff.Octree.parse_map: invalid maximum OctreeNode depth.");
		}
		
		utils.debug("parsing map coordinates, with max detail level of " + index_limit + "...");
		
		this.max_depth = index_limit;
		
		var center     = new Point3D(map.width / 2,map.width / 2, map.width / 2);
		var root_node  = new OctreeNode({
			center: center,
			radius: this.radius,
			octree: this,
			level: 0,
			number: 0
		});
		
		this.root = root_node;
		utils.debug("...map parsed");
		
	},
	
	insert : function(obj){
		if (!(obj instanceof AABB)){
			throw new Error("GeoStuff.Octree.insert: AABB expected.");
		}
		
		this.find(obj.points[0]).insert(obj);
	},
	
	find : function(point){
		if (!(point instanceof Point3D)){
			throw new Error("GeoStuff.Octree.find: Point3D expected.");
		}
		
		return this.root.find(point);
	}
	
});


var OctreeNode = AABB.extend({
	center   : null,
	radius   : null,
	parent   : null,
	octree   : null,
	level    : null,
	number   : null,
	points   : [],
	children : [],
	players  : {},
	npcs     : {},
	solids   : {},
	counter  :  0, 
	
	root : function(){
		return (this.parent === null) ? this : this.parent.root();
	},
	
	is_leaf : function(){
		return !(this.children.length == 8);
	},
	
	split : function(){
		
		if (this.points.length < 8){
			throw new Error("GeoStuff.OctreeNode.split: there was no previous loaded points to process.");
		}
		
		if (this.points.length > 8){
			throw new Error("GeoStuff.OctreeNode.split: there was too many previous loaded points to process ("+this.points.length+").");
		}
		
		if (this.octree && this.octree.max_depth - 1 === this.level ){
			utils.debug("OctreeNode: max depth level ("+this.level+") reached. Canceling split.");
			return this;
		}
		
		utils.debug("split begun.");
		utils.debug(this.center);
		this.children = Array(8);
		
		for (var i = 0; i < 8; i++){
			//calculate coords;
			
			var center = new Point3D();
			var radius = this.radius / 2;
			
			center.z = (i & 4) ? this.center.z + radius : this.center.z - radius;
			center.y = (i & 2) ? this.center.y + radius : this.center.y - radius;
			center.x = (i & 1) ? this.center.x + radius : this.center.x - radius;
			
			utils.debug( "Split[" + i + "]: " + center.x + "," + center.y + "," + center.z );
			
			var non = new OctreeNode({
				center : center,
				radius : radius,
				parent : this,
				level  : this.level + 1,
				number : i,
				octree : this.octree
			});
			this.children[i] = non;
		}
		
		utils.debug("split finished.");
		
		return this; //chainable
	},
	
	init: function(parms){
		if (!(parms.center instanceof Point3D)){
			throw new Error("GeoStuff.OctreeNode: Point3D expected.");
		}
		if (parms.level === undefined){
			throw new Error("GeoStuff.OctreeNode: precision level expected.");
		}
		if (parms.number === undefined){
			throw new Error("GeoStuff.OctreeNode: order number expected.");
		}
		
		parms.radius = (parms.radius === undefined) ? parms.center.depth * 2 : parms.radius;
		
		if (parms.parent === undefined){
			utils.debug("GeoStuff.OctreeNode: no parent, root node assumed.");
		}
		
		this.points = [];
		this.children = [];
		
		this._super(parms.center, parms.radius);
		this.octree = (parms.octree) ? parms.octree : null;
		this.level  = parms.level;
		this.number = parms.number;
		this.parent_number = (parms.parent) ? parms.parent.number : 0;
		
		utils.debug("new OctreeNode:", this.level, this.parent_number, this.number);
	},
	
	insert : function(obj){
		if (!(obj instanceof AABB)){
			throw new Error("GeoStuff.OctreeNode.insert: AABB expected.");
		}
		if (obj instanceof GWO.SolidObject){
			this.solids[obj.id] = obj;
			this.counter++;
		}
		
		if (this.octree.max_elements < this.counter){
			this.split().find(obj.points[0]).insert(obj);
		}
		
	},
	
	remove : function(obj){
		if (!(obj instanceof AABB)){
			throw new Error("GeoStuff.OctreeNode.remove: AABB expected.");
		}
		if (obj instanceof GWO.SolidObject){
			delete this.solids[obj.id];
			this.counter--;
		}
		
		if (this.octree.max_elements >= this.counter){
			for (var i = this.children.length; i >= 0; i++){
				delete this.children[i];
			}
		}
	},
	
	find : function(point){
		if (!(point instanceof Point3D)){
			throw new Error("GeoStuff.OctreeNode.find: Point3D expected.");
		}
		
		var item = this;
		for ( var i = 0; i < 8; i++ ){
			var tmp = this.children[i];
			if (
					(tmp.points[0].x <= point.x && point.x <= tmp.points[7].x) &&
					(tmp.points[0].y <= point.y && point.y <= tmp.points[7].y) &&
					(tmp.points[0].z <= point.z && point.z <= tmp.points[7].z)
				){
				item = tmp.is_leaf() ? tmp : tmp.find(point);
				break;
			}
		}
		return item;
	}
});


module.exports = GeoStuff = {
	"OctreeNode" : OctreeNode,
	"Octree" : Octree,
	"Area" : Area,
	"AABB" : AABB,
	"Point3D" : Point3D
};
