this.$jin.sync2middle = function( func ){
    
    return function( req, res, next ) {

        var thread = $jin.sync2async( func )

        thread( req, res, function jin_sync2middle_thread( error, result ){
			
            if( error ){
                next( error )
            } else if( result == null ){
                next()
            } else {
                res.setHeader( 'Cache-Control', result.cache || 'no-cache,no-store' )
                res.type( result.type || '.txt' )
	            if( result.cookies ) {
		            result.cookies.forEach( function( cookie ){
			            res.cookie( cookie.name, cookie.value, cookie )
		            } )
	            }
                res.send( String( result.content ) )
            }
            
        } )
        
    }
}
