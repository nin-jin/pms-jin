this.$jin.middle4pack=
function( pack ){
    pack = $jin.sourceFile( pack )
    
    return $jin.sync2middle( function( req, res ){
        var uri = $jin.uri( req.originalUrl.substring( 1 ) )
        
        var prefix = '$' + pack.name() + '_'
        var keys = Object.keys( uri.query() )
        
        while( keys.length ){
            var resource= $jin.glob( prefix + keys.join( '_' ) )
            
            if( !resource ){
                keys.pop()
                continue
            }
            
            return resource( uri ).resource_act( req.method.toLowerCase(), req )
        }
        
        return null
    } )
}
