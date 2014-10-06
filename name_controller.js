/**
 	Manages the overall process of fetching code from npm, and kicking off the analysis process,
 	and cleaning up after itself.
 */

 const
 	fs = require('fs'),
 	data_controller = require('./data_controller.js'),
 	inspector = require('./inspector.js'),
 	fetcher = require('./fetcher.js');


 function getNames() {
	
	var term = 'threejs',
		allResults = [],
		pf = new fetcher.PackageFetcher();

	pf.onCodeFetched = function( extractDir ) {
		var path = extractDir + '/package';
		// Check that a package directory was successfully created. Sometimes won't be there if there were errors
		fs.exists( path, function( exists ) {
			if (!exists) {
				console.log('Could not find a package directory in ' + extractDir );
				return;
			}
			inspector.getAnalysis( path, function( results ) {


				console.log( results );
				console.log( results.attributes.top10Names );
			});
		});
	}

	pf.fetchAllSearchResults( term );

 }