/**
 * @name $jin.server
 * @method server
 * @static
 * @member $jin
 */
$jin.property({ '$jin.server': function( ){
	var files = $node.express.static
	(   $node.path.resolve()
	,   { maxAge: 1000 * 60 * 60 * 24 * 365 * 1000 }
	)
	
	var resources = $jin.sync2middle( function( req, res ){
		var uri= $jin.uri.parse( req.originalUrl.substring( 1 ) )
		
		var keys= Object.keys( uri.query() )
		console.log(keys)
		while( keys.length ){
			var resource = $jin.server.resources( keys.join( ';' ) )
			
			if( !resource ){
				keys.pop()
				continue
			}
			
			return res.send( resource/*( uri )*/.get( req ) )
		}
		
		return null
	} )
	
	$node.express().use( files ).use( resources ).listen( 80 )
    $jin.log.info( 'Server started at 80 port' )
} })

/**
 * @name $jin.server.resources
 * @method resources
 * @static
 * @member $jin.server
 */
$jin.property.hash({ '$jin.server.resources': {} })
