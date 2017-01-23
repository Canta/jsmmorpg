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
    
    var pared1  = new OIMO.Body({type:"box", size:[this.width, this.height, 40], pos:[0,0,-20], world:world});
    var pared2  = new OIMO.Body({type:"box", size:[this.width, this.height, 40], pos:[0,0,this.depth -20], world:world});
    var pared3  = new OIMO.Body({type:"box", size:[this.width, this.height, 40], pos:[this.width ,0,-20], world:world});
    var pared4  = new OIMO.Body({type:"box", size:[this.width, this.height, 40], pos:[this.width,0,this.depth -20], world:world});
    
    for (var i = 0; i < 50; i++){
      var bola    = new OIMO.Body({type:'sphere', size:[10*0.5], pos:[Math.random() * 10000,Math.random() * 10000,Math.random() * 10000], move:true, world:world});
      this.mobiles.push(bola);
    }
    
    this.statics.push(ground, pared1, pared2, pared3, pared4);
    
    this._super();
    
  }
});
