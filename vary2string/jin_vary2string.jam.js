$jin.method( '$jin.vary2string', function( prefix, vary, postfix ){
    if( !vary ) vary= {}
    
    var chunks= []
    for( var key in vary ){
        chunks.push( key + '=' + vary[ key ] )
    }
    chunks.sort()
    
    if( prefix ) chunks.unshift( prefix )
    if( postfix ) chunks.push( postfix )
    
    return chunks.join( '.' )
} )
