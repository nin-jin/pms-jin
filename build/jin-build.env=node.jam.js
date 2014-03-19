$jin.klass({ '$jin.build': [] })

$jin.module( function(){ this[ '$jin.build' ] = {
	
	'.pack': [ $jin.property, $jin.file ],
	
	'.vary': [ $jin.property, null ],
	
	'.sources': [ $jin.atom.prop, {
		pull: function( prev ){
			$jin.log( this.pack().relate(), this.vary() )
			throw new Error
			return $jin.file( '.' ).index( this.vary(), this.pack().deepModuleList() )
		},
		merge: function( next, prev ){
			return ( String( next ) == String( prev ) ) ? prev : next
		}
	}],
	
	'.jsSources': [ $jin.atom.prop, {
		pull: function( prev ){
			$jin.log( this.pack().relate(), this.vary() )
			
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
			$jin.log( this.pack().relate(), this.vary() )
			
			return [].concat.apply( [], this.sources().map( function( src ){
				return src.cssFiles()
			} ) )
		},
		merge: function( next, prev ){
			return ( String( next ) == String( prev ) ) ? prev : next
		}
	}]
	
}})



