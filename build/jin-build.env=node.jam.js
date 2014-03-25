$jin.klass({ '$jin.build': [ '$jin.registry' ] })

$jin.module( function(){ this[ '$jin.build' ] = {
	
	'.urn': [ $jin.property, function( ){
		return $jin.uri.parse( this.id() )
	}],
	
	'.pack': [ $jin.property, function( ){
		return $jin.file( this.urn().path() )
	}],
	
	'.vary': [ $jin.property, function( ){
		return this.urn().query()
	}],
	
	'.sources': [ $jin.atom.prop, {
		pull: function( prev ){
			var tree = this.dependTree()
			var sources = []
			
			tree.forEach( function collect( node ){
				for( var key in node ){
					if( key ) collect( node[ key ] )
					else sources = sources.concat( node[ key ] )
				}
			})
			
			return sources.map( $jin.file )
		},
		merge: function( next, prev ){
			return ( String( next ) == String( prev ) ) ? prev : next
		}
	}],
	
	'.jsSources': [ $jin.atom.prop, {
		pull: function( prev ){
			return [].concat.apply( [], this.sources().map( function( src ){
				return src.jsFiles()
			} ) )
		},
		merge: function( next, prev ){
			return ( String( next ) == String( prev ) ) ? prev : next
		}
	}],
	
	'.cssSources': [ $jin.atom.prop, {
		pull: function( prev ){
			return [].concat.apply( [], this.sources().map( function( src ){
				return src.cssFiles()
			} ) )
		},
		merge: function( next, prev ){
			return ( String( next ) == String( prev ) ) ? prev : next
		}
	}]
	
}})



