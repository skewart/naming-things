
var should = require('should'),
	inspector = require('../inspector.js');


describe('inspector', function() {
	describe('#getNameParts', function() {

		it( 'should properly identify the parts of a name', function() {
			var result = inspector.getNameParts( "getNameParts" );
			result.should.be.length(3);
			result.should.containEql('get');
			result.should.containEql('name');
			result.should.containEql('parts');
		});

		it( 'should handle camelCase single-letter words', function() {
			var result = inspector.getNameParts( "thisIsATest" );
			result.should.be.length(4);
			result.should.containEql('this');
			result.should.containEql('is');
			result.should.containEql('a');
			result.should.containEql('test');

		});

		it( 'should handle single-word names', function() {
			var result = inspector.getNameParts( "foo" );
			result.should.be.length(1);
			result.should.containEql('foo');
		});

		it( 'should handle single-letter names', function() {
			var result = inspector.getNameParts( 'i' );
			result.should.be.length(1);
			result.should.containEql('i');
		});

		it( 'should handle snake_case', function() {
			var result = inspector.getNameParts('foo_bar_baz');
			result.should.be.length(3);
			result.should.containEql('foo');
			result.should.containEql('bar');
			result.should.containEql('baz');
		});
		
		// inspector.getNameParts( "FOO_BAR").should.eql(['foo', 'bar']);
		// inspector.getNameParts( "FOOBAR" ).should.eql(['foobar']);
		// inspector.getNameParts( "_someRandomFunc").should.eql(['some','random','func']);
		// inspector.getNameParts( "HeyThereName").should.eql(['hey','there','name']);
		// inspector.getNameParts( "thisURL").should.eql(['this','url']);
		// inspector.getNameParts( "getXMLDocument" ).should.eql(['get','xml','document']);
		// inspector.getNameParts( "XMLHttpRequest" ).should.eql(['xml','http','request']);
	
	});
});
