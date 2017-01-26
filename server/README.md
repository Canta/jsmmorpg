jsmmorpg server, for node.js
=========================

An implementation of a pure javascript mmorpg map server.
It uses websockets for communications, and i've choosen a few years 
ago Oimo.js for basic server-side physics.

The project is basically a few base classes, some map mechanics, 
physics, and communication for clients. 

The idea is to implement multiple map servers as required, and have 
some kind of communication between server-side processes. I want to 
work with the event emitter pattern for all of the objects, so 
eventually i'll need another process for smart message handling.

I have all the time in the world for this, so i'll let the project to 
grow to whatever it want, whenever it want.

Canta.-
