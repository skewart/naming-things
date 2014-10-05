

const 
	fs = require('fs'),
	npm = require('npm'),
	request = require('request'),
	process = require('child_process'),
	tarball = require('tarball-extract'),
	npmconf = require('npmconf'),
	RegClient = require('npm-registry-client');


/**
	Fetches the URL for the tarball of a package from npm and unpacks it
	@param {string} packageName - The name of the package you want to fetch
	@param {function} callback	- A callback function to be called when the package has been fetched.
 */
function fetchPackage( packageName, callback ) {

	var uri = 'http://registry.npmjs.org/' + packageName;

	// Do I need to do this every time?
	npmconf.load({}, function(err, conf) {

		var client = new RegClient(conf);
		client.get(uri, {timeout:1000}, function( error, data, raw, res ) {
			if (err) {
				console.log( err );
				return;
			}
			
			var latest = data['dist-tags'].latest,
				latestTarballURL = data.versions[ latest ].dist.tarball;

			fetchTarball( packageName, latestTarballURL, callback );			

		});

	});

}


/**
 	Downloads and unpacks the tarball of source code for a given project and puts it all in a 
 	given directory.
 	@param {string} packageName - The name of the package whose tarball you're fetching
 	@param {string} tarballURL 	- The URL for the tarball you're fetching
 	@param {function} callback	- A callback function that is called when the tarball has been fetched and upacked
 */
function fetchTarball( packageName, tarballURL, callback ) {

	var tmpDirPath = process.env.PKG_TEMP_DIR || './tmp' 
		pkgDirPath = tmpDirPath + '/' + packageName,
		tarballPath = pkgDirPath + '/' + packageName + '.tar.gz',
		extractDir = pkgDirPath + '/' + packageName;

	fs.exists( tmpDirPath, function(exists) {

		// If you've already downloaded the package.  This should never happen.
		if (exists) {
			// TODO Figure out the best thing to do in this situation. fs.rmdir ? Just return?
			return;
		}

		fs.mkdir( pkgDirPath, function(err) {
			if (err) {
				console.error( err );
				return;
			}
			tarball.extractTarballDownload( tarballURL, tarballPath, extractDir, {}, function(err, result) {
				if ( err ) {
					console.error( err );
					return;
				}
				callback( result );
			});
		});

	});

}


/**
	Fetches source code for all of the packages that match a given search term and then calls a callback
	@param {string} searchTerm 	- The string to be used as the search term
	@param {function} callback	- A callback function that gets called when the source code has been fetched
 */
function fetchAllSearchResults( searchTerm, callback ) {

	// TODO Figure out what we really need here, probably just the name
	var url = 'http://npmsearch.com/query?fl=name,description,homepage&rows=200&sort=rating+desc&q=' + searchTerm;

	request({json: true, url: url}, function(err, resp, data) {
		if (err) {
			console.log(err);
			return;
		}
		var results = data.results;
		for ( var i = 0, len = results.length; i < len; i++ ) {
			fetchPackage( results[i].name, callback );
		}
	});
}


