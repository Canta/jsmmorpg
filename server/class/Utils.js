
var EventEmitter  = require( "events" ).EventEmitter,
    Class         = require( "./lib/class.js" ).Class,
    Q             = require( "q" );

EventEmitter.prototype.off = function(name, arg){
  if (name === undefined){
    return this.removeAllListeners();
  } else if (arg === undefined){
    return this.removeAllListeners(name);
  } else {
    return this.removeListener(name,arg);
  }
};

module.exports = Util = (function(){
  
  var ret = function(){};
  ret.EventEmitter = EventEmitter;
  ret.Class = Class;
  ret.Deferred = Q.defer;
  
  //Make all functions extendable.
  Function.prototype.extend = Class.extend;
  ret.PromisedEmitter = ret.Deferred.extend(new EventEmitter());
  
  //Add a new isA function acting like the instanceOf operator, but 
  //intended for non instantiated classes.
  //Basically, it does an instanceof against the class prototype.
  Function.prototype.isA = function(something){
    return (something === undefined || something === null) ? false : this.prototype instanceof something;
  };
  Object.prototype.isA = function(something){
    return (something === undefined || something === null || this.prototype === undefined) ? false : this.prototype instanceof something;
  };
  
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
    if (dest.prototype){
      console.log("mix",source,dest);
      for (var k in source.prototype){
        dest.prototype[k] = source.prototype[k];
      }
    } else {
      dest.prototype = ret.copy(source.prototype);
    }
    
    for (var k in source){
      dest[k] = source[k];
    }
    
    return dest;
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
  
  ret.debugging = false;
  
  /**
   * debug function.
   * Prints a message in the console output if the namespace var 
   * "debugging" is set to true. 
   * 
   * @author Daniel Cantarín <omega_canta@yahoo.com>
   */
  
  ret.debug = function(){
    if (ret.debugging !== true) {
      return;
    }
    var a = new Date();
    var output = Array();
    var str = a.getHours() + ":" + a.getMinutes() + ":" + a.getSeconds() + "." + a.getMilliseconds() + " [ DEBUG ] - ";
    for (var i in arguments){
      output.push(arguments[i]);
    }
    return console.log(str, output);
  }
  
  /**
   * limit function.
   * Given a value, and a max and min possible values, it evaluates if
   * the value is inside that range; otherwise, it returns the range 
   * limit.
   * 
   * @author Daniel Cantarín <omega_canta@yahoo.com>
   * 
   */
  ret.limit = function(min, max, v) {
    var ret = (v < min) ? min : v;
    ret = (v > max) ? max : v;
    return v;
  };
  
  /**
   * inside function.
   * Given a value, and a max and min possible values, it evaluates if
   * the value is inside that range.
   * 
   * @author Daniel Cantarín <omega_canta@yahoo.com>
   * 
   */
  ret.inside = function(min, max, v) {
    return v >= min && v <= max ;
  };
  
  return ret;
})();
