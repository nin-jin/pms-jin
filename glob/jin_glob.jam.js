$jin.glob = function $jin_glob( name, value ){
    var keyList = name.split( '.' )
    var current = $jin.root()
    var currentName = ''
    
    for( var i = 0; i < keyList.length - 1; ++i ){
        var key = keyList[i] || 'prototype'
        
        if(!( key in current )){
            current[ key ] = $jin.trait.make( keyList.slice( 0, i + 1 ).join( '.' ) )
        }
        
        current = current[ key ]
    }
    
    var key = keyList[ keyList.length - 1 ] || 'prototype'
    
    if( arguments.length > 1 ){
        current[ key ] = value
    } else {
        value = current[ key ]
    }
    
    return value
}
