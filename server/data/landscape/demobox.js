var utils = require("../../class/utils");
var gwo = require("../../class/gameworldobjects");

function StaticDemoBox(){
	return gwo.StaticObject.extend(this);
}

function MovableDemoBox(){
	return gwo.MobileObject.extend(this);
}

module.exports = DemoBoxes = {
	StaticDemoBox = StaticDemoBox(),
	MovableDemoBox = MovableDemoBox()
};
