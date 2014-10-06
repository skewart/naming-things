/**
	Handles interacting with the npm registry, searching for packages, fetching information
	about packages, and getting source code into a temporary directory on the file system.
 */


const 
	fs = require('fs'),
	npm = require('npm'),
	request = require('request'),
	tarball = require('tarball-extract'),
	npmconf = require('npmconf'),
	RegClient = require('npm-registry-client');


/**
	A little class to wrap around these methods and provide a way to attach event
	listeners for key events.
 */
function PackageFetcher() {
	this.onCodeFetched = false;
}


/**
	Fetches the URL for the tarball of a package from npm and unpacks it
	@param {string} packageName - The name of the package you want to fetch
 */
PackageFetcher.prototype.fetchPackage = function( packageName ) {

	var self = this,
		uri = 'http://registry.npmjs.org/' + packageName;

	// Do I need to do this every time?
	npmconf.load({}, function(err, conf) {

		var client = new RegClient(conf);
		client.get(uri, {timeout:1000}, function( error, data, raw, res ) {
			if (err) {
				console.log( err );
				return;
			}
			
			if (!data['dist-tags'] || !data.versions) {
				console.log('No dist-tags or versions found for ' + packageName + '. Giving up.');
				return;
			}

			var latest = data['dist-tags'].latest,
				latestTarballURL = data.versions[ latest ].dist.tarball;

			self.fetchTarball( packageName, latestTarballURL );			

		});

	});

}


/**
 	Downloads and unpacks the tarball of source code for a given project and puts it all in a 
 	given directory.
 	@param {string} packageName - The name of the package whose tarball you're fetching
 	@param {string} tarballURL 	- The URL for the tarball you're fetching
 */
PackageFetcher.prototype.fetchTarball = function( packageName, tarballURL ) {

	var self = this,
		tmpDirPath = process.env.PKG_TEMP_DIR || __dirname + '/tmp',
		pkgDirPath = tmpDirPath + '/' + packageName,
		tarballPath = pkgDirPath + '/' + packageName + '.tar.gz',
		extractDir = pkgDirPath + '/' + packageName;
	
	fs.exists( extractDir, function(exists) {

		// If you've already downloaded the package.  This should never happen.
		if (exists) {
			// TODO Figure out the best thing to do in this situation. fs.rmdir ? Just return?
			console.log('directory already exists for ' + packageName );
			return;
		}

		fs.mkdir( pkgDirPath, function(err) {
			if (err) {
				console.log('Error trying to make a directory at ' + pkgDirPath );
				console.error( err );
				return;
			}
			tarball.extractTarballDownload( tarballURL, tarballPath, extractDir, {}, function(err, result) {
				if ( err ) {
					console.error( err );
					return;
				}
				if ( self.onCodeFetched ) {
					self.onCodeFetched.call( self, extractDir );
				}
			});
		});

	});

}


/**
	Fetches source code for all of the packages that match a given search term and then calls a callback
	@param {string} searchTerm 	- The string to be used as the search term
 */
PackageFetcher.prototype.fetchAllSearchResults = function( searchTerm ) {

	// TODO Figure out what we really need here, probably just the name
	var self = this,
		url = 'http://npmsearch.com/query?fl=name,description,homepage&rows=200&sort=rating+desc&q=' + searchTerm;

	request({json: true, url: url}, function(err, resp, data) {
		if (err) {
			console.log(err);
			return;
		}
		var results = data.results;
		for ( var i = 0, len = results.length; i < len; i++ ) {
			self.fetchPackage( results[i].name );
		}
	});
}


module.exports = {
	PackageFetcher: PackageFetcher
}


