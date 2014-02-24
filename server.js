var port = 8080;

var express = require('express');
var app = express();
var io = require('socket.io');
var mongo = require('mongodb').MongoClient;

app.set('views', __dirname + '/views')
	//Set plain HTML as our template engine, requiring EJS
	.engine('html', require('ejs').renderFile)
	//Ensure that routes aren't overwritten by static files
	.use(app.router)
	//All our client-side assets will be stored in a public dir
	.use(express.static(__dirname + '/public'))
	/*** Our routes ***/
	.get('/', function(req, res) {
		res.render('index.html');
	}).get('/sim', function(req, res) {
		res.render('simulator.html');
});

//Connect to db specified in url of
//mongo.connect(url, callback)
//Url= mongodb://<host>/<database>
//More info: http://mongodb.github.io/node-mongodb-native/
//driver-articles/mongoclient.html#basic-parts-of-the-url
mongo.connect('mongodb://127.0.0.1/sim', function(err, db) {	
	
	//TODO: Nesting level = 3; refactor this
	//by moving callback functions outside
	
	if (err) throw err;

	//When someone connects through socket.io
	io.listen(app.listen(port)).on('connection', function(socket) {

		//TODO: Filter socket connections comming from webapp
		//and add them to a room. I found out that I can assign		
		//name to sockets. So I just need to filter them by
		//socket.name :)

		//Debug
		console.log("New client connected.");
		
		//Get 'updates' collection from DB		
		var col = db.collection('updates');

		//Subscribe to update event
		socket.on('update', function(update) {
			//Add a timestamp
			update["date"] = Date.now();
			//Stringify the object
			var updateStr = JSON.stringify(update) + "\n";
			//Emit map update TODO: do NOT broadcast, emit to room only
			socket.broadcast.emit('mapUpdate', updateStr);			
			//Insert into mongodb collection
			col.insert(update, function(){
				console.log("Saved!");
			});			
		});
	});
});

