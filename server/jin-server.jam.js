/**
 * @name $jin.server
 * @method server
 * @static
 * @member $jin
 */
$jin.property({ '$jin.server': function( ){
	var server = $node.express()

	server.use( $node['cookie-parser']() )
	server.use( $node['body-parser'].json() )

	server.use( $jin.sync2middle( function jin_server_resources( req, res ){
        var started = Date.now()

        var uri = $jin.uri.parse( req.originalUrl.substring( 1 ) )
		
		var keys = Object.keys( uri.query() )
		
		while( keys.length ){
            var resource = $jin.server.resources( keys.join( '/' ) )
			
			if( !resource ){
				keys.pop()
				continue
			}

            var response = resource/*( uri )*/.get( req )
            
            var time = Date.now() - started
            $jin.log.info( req.url, time )

            return response // && res.send( response )
		}
		
		return null
	} ) )

	server.use( $node.express.static( $node.path.resolve(), { maxAge: 1000 * 60 * 60 * 24 * 365 * 1000 } ) )
	
	var port = 8008
	server.listen( port )
	
    $jin.log.info( 'Server started at ' + port + ' port' )
} })

/**
 * @name $jin.server.resources
 * @method resources
 * @static
 * @member $jin.server
 */
$jin.property.hash({ '$jin.server.resources': {} })
