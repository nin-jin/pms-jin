this.$jin.sync2middle=
$jin.proxy( { apply: function( func, self, args ){
    var req = args[ 0 ]
    var res = args[ 1 ]
    var next = args[ 2 ]
    
    var started = Date.now()
    
    var thread = $jin.sync2async( func )
    
    thread( req, res, function( error, result ){
        var time = Date.now() - started
        res.setHeader( 'x-jin-sync2middle-time', time )
        
        if( error ){
            next( error )
        } else if( result == null ){
            next()
        } else {
            res.type( result.type || '.txt' )
            res.setHeader( 'Cache-Control', result.cache || 'no-cache' )
            res.send( String( result.content ) )
        }
    } )
    
} } )
