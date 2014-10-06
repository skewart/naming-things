/**
 	In charge of storing and fetching the stored data.
 */

 const 
 	mongo = require('mongojs');


/**
	A class in charge of interacting with the data storage system.
 */
function DataController( collection, uri ) {

	if ( !collection ) {
		console.log('ERROR: No collection parameter given to the DataController constructor.');
		console.log('Please give the name of a collection to use for storing data.');
		this._isUsable = false;
		return;
	}

	var uri = uri || process.env.MONGO_DB_URI;

	if ( !uri ) {
		console.log('ERROR: No database URI passed to DataController constructor or present in MONGO_DB_URI environment variable.' );
		console.log('Cannot connect to the database!');
		this._isUsable = false;
		return;
	}

	this.collection = collection;
	this._db = mongojs.connect( uri, [ this.collection ] );

}


/**
	Saves data to the data store. 
	@param {Object} document	- An object containing the data you want to store
	@param {String} key			- A string containing the unique identifier you wan to use for accessing this data
 */
DataController.prototype.save = function( key, document ) {

	this._db[ this.collection ].save( obj, function( err, doc ) {
		if ( err ) {
			console.log("Error saving document to datbase.");
		}
		// TODO Confirm the save somehow?
	});

}


/**
	Fetches data at a given key
	@param {String}	key		- The unique identifying key for the document you want to get.
 */
DataController.prototype.get = function( key ) {

}
