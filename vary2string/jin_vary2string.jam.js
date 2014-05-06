$jin.method( '$jin.vary2string', function( prefix, vary, postfix ){
    if( !vary ) vary= {}
    
    var chunks= []
    for( var key in vary ){
		if( vary[ key ] == null ) continue
        chunks.push( key + '=' + vary[ key ] )
    }
    chunks.sort()
    
    if( prefix ) chunks.unshift( prefix )
    if( postfix ) chunks.push( postfix )
    
    return chunks.join( '.' )
} )
