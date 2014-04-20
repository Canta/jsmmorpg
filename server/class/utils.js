
var EventEmitter = require( "events" ).EventEmitter;

module.exports = Util = (function(){
	
	var ret = function(){};
	
	/**
	 * mix function
	 * Helper function for mixing objects properties.
	 * 
	 * @author Daniel Cantarín <omega_canta@yahoo.com>
	 * 
	 * @param {Object} source
	 * An object from where taking the properties
	 * 
	 * @param {Object} obj
	 * An object that will have the source's properties added.
	 * 
	 * @this {Function} mix
	 * 
	 * */
	ret.mix = function(source, dest){
		for (var k in source.prototype){
			dest.prototype[k] = source.prototype[k];
		}
		for (var k in source){
			dest[k] = source[k];
		}
		
		return dest;
	};
	
	/**
	 * def function.
	 * Helper function for easy and clean class definitions.
	 * It lets me define properties an methods in a class implementing 
	 * prototype inheritance in a not so verbose way. 
	 * 
	 * @author Daniel Cantarín <omega_canta@yahoo.com>
	 * 
	 * @param {Function} parent
	 * a parent class to be inherited from.
	 * 
	 * @param {Object} obj
	 * a function or object to inherit the parent's properties.
	 * 
	 * @this {Function} def
	 */
	ret.def = function(parent,obj){
		
		obj = new parent();
		obj = ret.mix(parent, obj);
		
		if (typeof parent.on != "function" || typeof parent.emit != "function"){
			var ee = new EventEmitter();
			obj = ret.mix(ee,obj);
		}
		
		return obj;
	};

	/**
	 * clone function.
	 * Given an object, it returns a clone of the object.
	 * Cloned objects retains the "is-a" relation for instanceof.
	 * 
	 * @author Daniel Cantarín <omega_canta@yahoo.com>
	 * @param {Object} o
	 * An object to be cloned
	 */
	ret.clone = function(o){
		function Clone() { }
		Clone.prototype = o;
		return new Clone();
	};
	
	
	/**
	 * copy function.
	 * Given an object, it returns a copy of the object.
	 * The returning object is identical to the given one, but it does
	 * NOT works with the instanceof operator.
	 * 
	 * @author Daniel Cantarín <omega_canta@yahoo.com>
	 * @param {Object} o
	 * An object to be copied
	 */
	ret.copy = function(o){
		if (typeof o.toSource !== "undefined"){
			return eval(o.toSource());
		} else if (typeof uneval !== "undefined"){
			return eval(uneval(o));
		} else if (JSON) {
			var o2 = JSON.parse(JSON.stringify(o));
			o2.prototype = o;
			return o2;
		}
	};
	
	/**
	 * find function.
	 * Given a collection and an object, this function returns another
	 * colection filled with the items that matches the criteria stated
	 * in the given object.
	 * 
	 * @author Daniel Cantarín <omega_canta@yahoo.com>
	 * @param {Array} c
	 * An array (collection) with objects inside.
	 * @param {Object} o
	 * An object of arbitrary properties and values that are supposed to
	 * be found inside objects in the collection.
	 */
	ret.find = function(c, o){
		var r = [];
		for (var i in c){
			for (var i2 in o){
				if (c[i][i2] && c[i][i2] == o[i2]){
					r.push(c[i]);
				}
			}
		}
		return r;
	};
	
	
	return ret;
})();
