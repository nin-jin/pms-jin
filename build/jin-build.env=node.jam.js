$jin.klass({ '$jin.build': [] })

$jin.property({ '$jin.build..pack': $jin.file })
$jin.property({ '$jin.build..vary': null })

$jin.atom.prop({ '$jin.build..sources': {
	pull: function( prev ){
		$jin.log( this.pack().relate(), this.vary() )
		
		return $jin.file( '.' ).index( this.vary(), this.pack().deepModuleList() )
	},
	merge: function( next, prev ){
		return ( String( next ) == String( prev ) ) ? prev : next
	}
}})

$jin.atom.prop({ '$jin.build..jsSources': {
	pull: function( prev ){
		$jin.log( this.pack().relate(), this.vary() )
		
		return [].concat.apply( [], this.sources().map( function( src ){
			return src.jsFiles()
		} ) )
	},
	merge: function( next, prev ){
		return ( String( next ) == String( prev ) ) ? prev : next
	}
}})

$jin.atom.prop({ '$jin.build..cssSources': {
	pull: function( prev ){
		$jin.log( this.pack().relate(), this.vary() )
		
		return [].concat.apply( [], this.sources().map( function( src ){
			return src.cssFiles()
		} ) )
	},
	merge: function( next, prev ){
		return ( String( next ) == String( prev ) ) ? prev : next
	}
}})

