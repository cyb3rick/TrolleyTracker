var express = require('express'),
	fs		= require('fs'),
	app 	= express(),
	port	= 8080,
	io		= require('socket.io');
	//.listen(app.listen(port));
	
app.set('views', __dirname + '/views')
	//Set plain HTML as our template engine, requiring EJS
	.engine('html', require('ejs').renderFile)
	//Ensure that routes aren't overwritten by static files
	.use(app.router)
	//All our client-side assets will be stored in a public dir
	.use(express.static(__dirname + '/public'))
	/*** Our routes ***/
	.get('/', function(req,res){
		res.render('index.html');
	})
	.get('/sim', function(req,res){
		res.render('simulator.html');
	});


io.listen(app.listen(port)).on('connection', function(socket) {
	
	//TODO: Filter socket connections comming from webapp
	//and add them to a room. 	
	
	//Debug
	console.log("New client connected.");	
	
	//Subscribe to update event
	socket.on('update', function(update) {				
		// Add a timestamp
		update["date"] = Date.now();
		// Stringify the object		
		var updateStr = JSON.stringify(update) + "\n";			
		//Emit map update TODO: do NOT broadcast, emit to room only
		socket.broadcast.emit('mapUpdate', updateStr);		
		
		// test write data to text file
		fs.appendFile("/tmp/updates.txt", updateStr, function(err) {
			if (err) throw err;			
			console.log("Update saved successfully.");
		});		
	});	
});

