$jin.request = function( options ){
    return $jin.async2sync( function ( config , done ){
        $node.request( config , function( error , resp , body ) {
            if( resp ) resp.body = body
            done( error , resp )
        })
    } )( options )
}
