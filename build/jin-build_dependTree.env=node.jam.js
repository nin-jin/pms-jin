/**
 * @name $jin.build#dependTree
 * @method dependTree
 * @member $jin.build
 */
$jin.atom1.prop({ '$jin.build..dependTree': {
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
		
		var moduleList = this.modules()
		
		var tree = moduleList.map( function proceedDep( mod ){
			var subTree = []
			
			var pack = root.child( mod.relate( root ).replace( /\/.*/, '' ) )
			pack.require()
			
			//var names = mod.relate( root ).split( '/' )
			//mod = root
			//while( names.length ){
			//	var cur = mod.child( names[0] )
			//	if( mod.childList().indexOf( cur ) === -1 ) break
			//	names.shift()
			//	mod = cur
			//}
			while( !mod.exists() ) mod = mod.parent()
			
			if( mod === root ) return
			
			if( ~touchedMods.indexOf( mod ) ) return
			touchedMods.push( mod )
			
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
			
			srcs.forEach( function( src ){
				var srcDeps = src.dependList().map( function( path ){
					if( path[0] === '.' ) var dep = src.parent().resolve( path )
					else var dep = root.resolve( path )
					return dep
				} )
				depMods = depMods.concat( srcDeps )
			} )
			
			var depList =  depMods.map( proceedDep ).filter( function( dep ){ return dep } )
			
			srcs = srcs.filter( function( src ){
				return !~indexSrcs.indexOf( src )
			} )
			indexSrcs = indexSrcs.concat( srcs )
			
			depHash = {}
			depList.forEach( function( dep ){
				for( var key in dep ) depHash[ key ] = dep[ key ]
			} )
			depHash[ '' ] = srcs.map( function( file ){ return file.relate() } )
			var node = {}
			node[ mod.relate() ] = depHash
			return node
		} )
		
		return tree
	}
}})
