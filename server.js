/*
 A simple application for inspecting and visualizing the code structure of JavaScript apps.
 */


var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	inspector = require('inspector.js');

var PORT = 8888;

app.use("/", express.static(__dirname + "/client" ) );
app.use(express.bodyParser());
app.set("views", __dirname + "/client/views" );
app.set("view engine", "jade");


// Serve up the homepage of the app
app.get("/", function(req, res) {
	res.render('home.jade', {});
});


// Process named package, returning visualization instructions
app.post("/api/viz/packages/:package_name", function(req, res) {
	// Call some method on inspector.js -- this might need to be wrapped in a websocket
	inspector.getGraph('/Users/ske/js/playground/codetopo/tmp/helloworld/hello.js', function( results ) {
		res.send( JSON.stringify( results ) );
	});
});


http.listen( PORT, function() {
	console.log('code-topo listening on port ' + PORT);
});