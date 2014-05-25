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
map_server.maps    = [];

console.log("Loading assets...");
var DATA = require("./data");

for (var i in DATA.maps) {
	if (DATA.maps[i].isA(CLASSES.Map)){
		/*
		var o = new CLASSES.GeoStuff.Octree( DATA.maps[i] );
		map_server.octrees.push(o);
		map_server.octrees[map_server.octrees.length-1].map.start();
		*/
		
		map_server.maps.push( new DATA.maps[i]() );
		map_server.maps[map_server.maps.length - 1].start();
		//map_server.maps[map_server.maps.length - 1].on("collision",function(pair){console.log(pair[0].parent.getMatrix())});
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
	
	var map = map_server.maps[map_server.maps.length - 1];
	
	var x = Math.floor(Math.random() * 10000);
	var y = Math.floor(Math.random() * 10000);
	var z = Math.floor(Math.random() * 10000);
	
	objs = map.get_objects_in_area({x: x, y: y, z: x}, 1000);
	
	var start = {
		current_map    : map.name,
		current_coords : {x: x, y: y, z: z},
		objects        : objs.length
	};
	
	ws.send( JSON.stringify( start ) );
});

console.log("Server running.");
