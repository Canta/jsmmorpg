/*
 * Startup steps:
 * 1) Load game logic files.
 * 2) Load status from the world (db persisted).
 * 3) Startin up socket services.
 */
var map_server = {};

console.log("Loading classes...");
var CLASSES = require("./class");

map_server.octrees = [];

console.log("Loading assets...");
var DATA = require("./data");

for (var i in DATA.maps){
	if (DATA.maps[i] instanceof CLASSES.Map){
		var o = new CLASSES.GeoStuff.Octree( DATA.maps[i] );
		map_server.octrees.push(o);
		map_server.octrees[map_server.octrees.length-1].map.start();
	}
}

console.log("Loading world status...");
//TODO: add some world status handling.

console.log("Loading socket services...");
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});

wss.on('connection', function(ws) {
	console.log("new connection from "+ws._socket.remoteAddress);
	ws.on('message', function(message) {
		
	});
	
	var x = Math.floor(Math.random() * map_server.octrees[0].map.width);
	var y = Math.floor(Math.random() * map_server.octrees[0].map.height);
	var z = Math.floor(Math.random() * map_server.octrees[0].map.depth);
	
	var start = {
		current_map    : map_server.octrees[0].map.name,
		current_coords : {x: x, y: y, z: z}
	};
	
	ws.send( JSON.stringify( start ) );
});

console.log("Server running.");
