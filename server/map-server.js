/*
 * Startup steps:
 * 1) Load game logic files.
 * 2) Load status from the world (db persisted).
 * 3) Startin up socket services.
 */
console.log("Loading classes...");
var CLASSES = require("./class");
console.log("Loading assets...");
var DATA = require("./data");
console.log("Loading world status...");
//TODO: add some world status handling.

console.log("Loading socket services...");
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});

wss.on('connection', function(ws) {
	console.log("new connection from "+ws._socket.remoteAddress);
	ws.on('message', function(message) {
		
	});
	
	var x = Math.floor(Math.random() * 1000);
	var y = Math.floor(Math.random() * 1000);
	ws.send("{current_map: \"DemoMap\", current_coords:{x:"+x+",y:"+y+"}}");
});

console.log("Server running.");
