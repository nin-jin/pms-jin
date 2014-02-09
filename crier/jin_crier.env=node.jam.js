$jin.klass({ '$jin.crier': [] })

$jin.property( '$jin.crier..listenerMap', Object )

$jin.method( '$jin.crier..listen', function( eventName, handler ){
    var map = this.listenerMap()
    var handlerList = map[ eventName ] = map[ eventName ] || []
    
    if( !~handlerList.indexOf( handler ) ){
        handlerList.push( handler )
    }
    
    return $jin.listener().crier( this ).eventName( eventName ).handler( handler )
})

$jin.method( '$jin.crier..forget', function( eventName, handler ){
    var map = this.listenerMap()
    var handlerList = map[ eventName ] = map[ eventName ] || []
    
    var index = handlerList.indexOf( handler )
    if( !index ) handlerList.splice( index, 1 )
    
    return this
})

$jin.method( '$jin.crier..scream', function( event ){
    var map = this.listenerMap()
    var eventName = event.type()
    
    var handlerList = map[ eventName ]
    if( !handlerList ) return this
    
    if( !event.target() ) event.target( this )
    
    handlerList.forEach( function( handler ){
        handler( event )
    })
    
    return this
})
