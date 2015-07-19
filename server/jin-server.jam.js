/**
 * @name $jin.server
 * @method server
 * @static
 * @member $jin
 */
$jin.property({ '$jin.server': function( ){
	var express = $node.express()
	var server = $node.http.Server(express)
	var socket = new $node.websocket.server({
		httpServer : server,
		maxReceivedFrameSize : 256 * 1024,
	})

	express.use( $node['cookie-parser']() )

	socket.on('request', function(request) {
		var connection = request.accept( 'jin-server', request.origin )
		$jin.log.info( 'WebSocket connection' )
		connection.on( 'message', function( message ) {
			$jin.sync2async( function() {
				if( message.type === 'utf8' ) {
					var req = Object.create( request )
					var mess = JSON.parse(message.utf8Data)
					req.method = mess.method
					req.headers = request.httpRequest.headers || {}
					req.body = mess.body || {}
					req.originalUrl = mess.uri
					var uri = $jin.uri.parse(mess.uri)
					req.params = uri.query()
					req.query = uri.query()

					var keys = Object.keys(uri.query())

					while (keys.length || $jin.server.resources('')) {
						var resource = $jin.server.resources(keys.join('/'))

						if (!resource) {
							keys.pop()
							continue
						}

						var response = resource.request(req)

						if( response ) {
							response.content.requestId = mess.requestId
							connection.sendUTF(JSON.stringify(response.content, null, '\t'))
						}

						return
					}

					$jin.log.error(new Error('No handler: ' + uri))
				}
			})( function( error , res ) {
				if( error ) $jin.log.error( error )
			})
		} )
		connection.on( 'close', function( reasonCode, description ) {
			$jin.log.info( 'Peer ' + connection.remoteAddress + ' disconnected.' )
		});
	})

	express.use( $node.compression() )
	express.use( $node.multer({
		fileSize : 10 * 1024 * 1024
	}) )
	express.use( $node['body-parser'].json({ limit : '1mb' }) )

	express.use( $jin.sync2middle( function jin_server_resources( req, res ){

        var uri = $jin.uri.parse( req.originalUrl.substring( 1 ) )
		
		var keys = Object.keys( uri.query() )
		
		while( keys.length || $jin.server.resources( '' ) ){
            var resource = $jin.server.resources( keys.join( '/' ) )
			
			if( !resource ){
				keys.pop()
				continue
			}

            var response = resource/*( uri )*/.request( req )

			if( response && !response.type ) {
				response.type = 'application/json'
				response.content = JSON.stringify( response.content , null , '\t' )
			}

            return response // && res.send( response )
		}

		return null
	} ) )

	express.use( $node.express.static( $node.path.resolve(), { maxAge: 1000 * 60 * 60 * 24 * 365 * 1000 } ) )

	var port = 8008
	server.listen( port )

    $jin.log.info( 'Server started at ' + port + ' port' )
	return express
} })

/**
 * @name $jin.server.resources
 * @method resources
 * @static
 * @member $jin.server
 */
$jin.property.hash({ '$jin.server.resources': {} })

$jin.server.resources( 'jin/server/header' , { request : function( req ) {
	for( var key in req.body ) {
		req.headers[ key ] = req.body[ key ]
	}
} } )
