$jin.property.hash({ '$jin.docs.registry': {
	pull: function( ){
		return []
	}
} })

$jin.method({ '$jin.docs.collect': function( source ){
	if( !source ) return $jin.definer.sources.map( $jin.docs.collect )
	
	function makeNS( path ){
		while( path ){
			var infos = $jin.docs.registry( path )
			if( !infos.length ) infos.push( {} )
			path = path.replace( /\.?[^.]*$/, '' )
		}
	}
	
	String( source ).replace( /\/\*\*([\s\S]+?)\*\//g, function( str, comment ){
		comment = comment.replace( /^\s*\*\s*/gm, '' )
		
		var info = {}
		
		comment.replace( /@class ([.$\w]+)?/g, function( str, path ){
			if( path ){
				$jin.docs.registry( path ).push( info )
				makeNS( path )
			}
			info.isClass = true
		})
		
		comment.replace( /@name ([.#$\w]+)/g, function( str, path ){
			path = path.replace( /#/g, '..' )
			$jin.docs.registry( path ).push( info )
			makeNS( path )
		})
		
		comment.replace( /@extends ([.#$\w]+)/g, function( str, path ){
			path = path.replace( /#/g, '..' )
			$jin.docs.registry( path ).push( info )
		})
		
		comment.replace( /@param ([{}.|$\w]+)? ([\[\].#$\w]+)/g, function( str, type, name ){
			var param = {}
			
			if( name[0] === '[' ) param.isOptional = true
			param.name = name.replace( /[\[\]]/g, '' )
			param.types = type.replace( /[{}]/g, '' ).split( '|' )
			
			info.params = info.params || []
			info.params.push( param )
		})
		
		comment.replace( /@returns ([{}.|$\w]+)?/g, function( str, type ){
			info.returns = type.replace( /[{}]/g, '' ).split( '|' )
		})
		
		info.descr = comment.replace( /@\w+( .*?)?[\r\n]+/g, '' ).trim()
	})
	
}})

$jin.method({ '$jin.docs.show': function( ){
	$jin.docs.view.root( 'docs' ).element().parent( document.body )
}})
