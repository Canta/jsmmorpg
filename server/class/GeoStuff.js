
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
	
	init : function(from, to){
		//from and to are supossed to be points
		if (!(typeof from === "object" && from instanceof Point3D)){
			throw new Error("GeoStuff.AABB: Point3D expected.");
		}
		if (!(typeof to === "object" && to instanceof Point3D)){
			throw new Error("GeoStuff.AABB: Point3D expected.");
		}
		
		this.points = [];
		//console.log("aabb.init",from,to);
		//Given 2 points in 3d space, "from" and "to", we create a box.
		for (var i = 0; i < 8; i++){
			var x,y,z;
			z = (i & 4) ? from.z : to.z;
			y = (i & 2) ? from.y : to.y;
			x = (i & 1) ? from.x : to.x;
			this.points.push(new Point3D(x,y,z));
		}
		
		return this;
	}
});

var OctreeNode = AABB.extend({
	children : [],
	coords : [],
	points : [],
	parent : null,
	
	root : function(){
		return (this.parent === null) ? this : this.parent.root();
	},
	
	is_leaf : function(){
		return !(this.children.length == 8);
	},
	
	divide : function(){
		
		if (this.points.length < 8){
			throw new Error("GeoStuff.OctreeNode.divide: there was no previous loaded points to process.");
		}
		
		if (this.points.length > 8){
			throw new Error("GeoStuff.OctreeNode.divide: there was too many previous loaded points to process ("+this.points.length+").");
		}
		
		for (var i = 0; i < 8; i++){
			//calculate coords;
			
			var from = new Point3D();
			var to   = new Point3D();
			
			if (i & 4) {
				from.z = this.points[0].z;
				to.z   = this.points[0].z / 2;
			} else {
				from.z = this.points[0].z / 2;
				to.z   = 0;
			}
			if (i & 2) {
				from.y = this.points[0].y;
				to.y   = this.points[0].y / 2;
			} else {
				from.y = this.points[0].y / 2;
				to.y   = 0;
			}
			if (i & 1) {
				from.x = this.points[0].x;
				to.x   = this.points[0].x / 2;
			} else {
				from.x = this.points[0].x / 2;
				to.x   = 0;
			}
			
			
			var coords = [from,to];
			
			var non = new OctreeNode(coords,this);
			this.children.push(non);
		}
		return this; //chainable
	},
	
	init: function(coords,parent){
		if (!(coords instanceof Array)){
			throw new Error("GeoStuff.OctreeNode: coordinates array expected.");
		}
		
		if (coords.length != 8 && coords.length != 2){
			throw new Error("GeoStuff.OctreeNode: either two or eight coordinates expected. "+coords.length+" received.");
		}
		this.points = [];
		console.log(this.prototype);
		this._super(coords[0], (coords.length == 8) ? coords[7] : coords[1]);
		this.points = this.prototype.points.slice(0);
	}
});

function Area(){
	this.points = [];
	this.notify = function(callback){
		
	};
	
	return this;
}

var Octree = utils.EventEmitter.extend({
	max_depth : 64,
	max_elements : 3,
	nodes : [],
	get_area : function(point, radius){
		
	},
	
	root : function(){
		return this.nodes[0];
	},
	
	init : function(mapa, specs){
		console.log("init octree:", mapa, specs);
		if (!(typeof mapa === "object" && mapa instanceof Map)){
			throw new Error("GeoStuff.Octree: Map expected.");
		}
		
		if (specs !== undefined){
			for (s in specs){
				this[s] = specs[s];
			}
		}
		
		var p_max = new Point3D(mapa.width,mapa.height, mapa.depth);
		var p_min = new Point3D(0,0,0);
		this.nodes.push(new OctreeNode([p_max, p_min]));
		
	}
});

module.exports = GeoStuff = {
	"OctreeNode" : OctreeNode,
	"Octree" : Octree,
	"Area" : Area,
	"AABB" : AABB,
	"Point3D" : Point3D
};
