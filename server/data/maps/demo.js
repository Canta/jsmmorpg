require("../../class/Map");
require("../landscape/DemoBoxes");

module.exports = DemoMap = new Map({
	width  : 1000,
	height : 1000,
	depth  : 1000,
	statics: [
		new DemoBoxes.StaticDemoBox({x:100, y:100, z:0})
	],
	mobiles: [],
	npcs   : [],
	mobs   : []
});
