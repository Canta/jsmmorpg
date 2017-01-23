var utils = require("../../class/Utils");
var gwo   = require("../../class/GameWorldObjects");

function StaticDemoBox(){
  return gwo.StaticObject.extend(this);
}

function MovableDemoBox(){
  return gwo.MobileObject.extend(this);
}

module.exports = DemoBoxes = {
  StaticDemoBox : StaticDemoBox,
  MovableDemoBox : MovableDemoBox
};
