require("../../class/Map");
require("../landscape/DemoBoxes");

module.exports = DemoMap = new Map({
	width  : 1000000,
	height : 100000,
	depth  : 1000000,
	name   : "DemoMap",
	statics: [
		new DemoBoxes.StaticDemoBox({x:100, y:0, z:100})
	],
	mobiles: [
		new DemoBoxes.MovableDemoBox({x:500, y:0, z:250})
	],
	npcs   : [],
	mobs   : []
});
