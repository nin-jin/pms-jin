$jin.lazyProxy = function( make ){
    var value
    var maked= false
    
    var get= function( ){
        if( maked ) return value
        value= make()
        maked= true
        return value
    }
    
    return $jin.proxy
    (   {   valueOf: function( target ){
                return target()
            }
        }
    )
    ( get )
}
