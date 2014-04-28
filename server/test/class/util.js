var utils = require("../../class/Utils");

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var should = chai.should();


var TestClass = utils.EventEmitter.extend({
	coso  : "coso!\n",
	coso2 : function(){
		var d = utils.Deferred();
		this.emit("coso2");
		var tmp = function(){
			console.log("resolve");
			d.resolve(1);
		}
		setTimeout(tmp, 1500);
		return d.promise;
	}
});

var TestClassDescendant = TestClass.extend({
	hola:"K ASE",
	coso2 : function(){
		console.log("coso2 en test descendant!");
		return this._super();
	}
});



it("Class.extend should return a class definition which prototype's should be compatible with instanceof operator", function(){
    expect(TestClass.prototype).to.be.an.instanceof(utils.EventEmitter);
});

it("An instance of a class created with extend should be compatible with instanceof operator", function(){
    expect(new TestClass()).to.be.an.instanceof(utils.EventEmitter);
});

it("Subclass created with extend should be compatible with instanceof operator", function(){
    expect(new TestClassDescendant()).to.be.an.instanceof(utils.EventEmitter);
});

it("coso2 promise should be resolved and return the number 1", function(){
    return (new TestClassDescendant()).coso2().should.eventually.equal(1);
});
