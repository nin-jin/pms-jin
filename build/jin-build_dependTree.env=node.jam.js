/**
 * @name $jin.build#dependTree
 * @method dependTree
 * @member $jin.build
 */
$jin.atom1.prop({ '$jin.build..dependTree' : {
	pull: function( prev ){
		var root = $jin.file( '.' )
		
		var vary = this.vary()
		var varyFilter= []
		for( var key in vary ){
			var val= vary[ key ]
			varyFilter.push( '\\.' + key + '=(?!' + val + '\\.)' )
		}
		varyFilter= RegExp( varyFilter.join( '|' ) || '^$' )
		
		var indexSrcs = []
		var touchedMods = []
		var touchedPriors = []
		
		var moduleList = this.modules()
		
		var tree = moduleList
			.map( function(m){ return proceedDep( m , 0 ) } )
			.filter( function( v ) { return v } ) 
		
		function proceedDep( mod , priority ){
			var subTree = []
			
			var pack = root.child( mod.relate( root ).replace( /\/.*/, '' ) )
			pack.require()
			
			while( !mod.exists() ) mod = mod.parent()
			
			if( mod === root ) return
			
			var touchedIndex = touchedMods.lastIndexOf( mod ) 
			if( touchedIndex >= 0 ) {
				if( touchedIndex = touchedMods.length - 1 ) return 
				if( priority >= touchedPriors[ touchedIndex + 1 ] ) {
					return
				}
			}
			touchedMods.push( mod )
			touchedPriors.push( priority )
			
			var depMods = []
			
			var parent = mod.parent()
			if( parent !== root ) depMods.push( parent )
			
			var srcs = mod.sourceList()
			
			srcs = srcs.filter( function( src ){
				return !varyFilter.test( src.name() )
			} )
			
			if( !srcs.length ) return
			
			srcs.sort( function( a, b ){
				var aNames = a.name().split( '.' )
				var bNames = b.name().split( '.' )
				var aName= aNames[0]
				var bName= bNames[0]
				if( aName.length < bName.length ) return -1
				if( aName.length > bName.length ) return 1
				if( aName < bName ) return -1
				if( aName > bName ) return 1
				if( aNames.length < bNames.length ) return -1
				if( aNames.length > bNames.length ) return 1
				if( a.name() < b.name() ) return -1
				if( a.name() > b.name() ) return 1
				return 0
			})
			
			var priors = {}
			srcs.forEach( function( src ){
				var dpl = src.dependList()
				Object.keys( dpl ).forEach( function( path ){
					if( path[0] === '.' ) var dep = src.parent().resolve( path )
					else var dep = root.resolve( path )
					depMods.push( dep )
					if( typeof priors[ dep ] === 'number' ) {
						priors[ dep ] = Math.min( priors[ dep ] , dpl[ path ] )
					} else {
						priors[ dep ] = dpl[ path ]
					}
					return dep
				} )
			} )
			
			var depList = depMods
				.map( function(m){ return proceedDep( m , priors[ m ] ) } )
				.filter( function( dep ){ return dep } )
			
			srcs = srcs.filter( function( src ){
				return !~indexSrcs.indexOf( src )
			} )
			indexSrcs = indexSrcs.concat( srcs )
			
			depHash = {}
			depHash[ ':priority' ] = priority
			depList.forEach( function( dep ){
				for( var key in dep ) depHash[ key ] = dep[ key ]
			} )
			depHash[ '' ] = srcs.map( function( file ){ return file.relate() } )
			var node = {}
			node[ mod.relate() ] = depHash
			return node
		}

		this.pack().buildFile( $jin.vary2string( 'index' , this.vary() , 'json' ) ).content( JSON.stringify( tree , null , '\t' ) )

		return tree
	}
}})
