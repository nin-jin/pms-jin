$jin.method( '$jin.dom..html', function( html ){
    if( arguments.length ){
        this.nativeNode().innerHTML = html
        return this
    } else {
        return this.nativeNode().innerHTML
    }
} )

if( $jin.support.xmlModel() === 'ms' ){
    
    $jin.mixin( '$jin.dom.ms', '$jin.dom' )
    
    $jin.method( '$jin.dom..toString', '$jin.dom.ms..toString', function( ){
        return String( this.nativeNode().xml )
    } )

    // works incorrectly =( use render instead
    $jin.method( '$jin.dom..transform', '$jin.dom.ms..transform', function( stylesheet ){
        var result= this.nativeNode().transformNode( $jin.dom( stylesheet ).nativeNode() )
        return $jin.dom.parse( result )
    } )

    $jin.method( '$jin.dom..render', '$jin.dom.ms..render', function( from, to ){
        from = $jin.dom( from ).nativeNode()
        to = $jin.dom( to ).nativeNode()
        
        to.innerHTML= from.transformNode( this.nativeDoc() )
    } )
    
    $jin.method( '$jin.dom..text', '$jin.dom.ms..text', function( value ){
        var node = this.nativeNode()
        if( arguments.length ){
            node.innerText = value
            return this
        } else {
            return node.innerText
        }
    } )
    
    $jin.method( '$jin.dom..select', '$jin.dom.ms..select', function( xpath ){
        var list= []
        
        var found= this.nativeNode().selectNodes( xpath )
        for( var i= 0; i < found.length; ++i ) list.push( $jin.dom( found[ i ] ) )
        
        return list
    } )

}

if( $jin.support.eventModel() === 'ms' ){

    $jin.method( '$jin.dom..listen', '$jin.dom.ms..listen', function( eventName, handler ){
        eventName = this.normalizeEventName( eventName )
        this.nativeNode().attachEvent( eventName, function( ){
            var event = $jin.dom.event( window.event )
            //if( event.type() !== eventName ) return
            return handler( event )
        } )
        return this
    } )
    
    $jin.method( '$jin.dom..forget', '$jin.dom.ms..forget', function( eventName, handler ){
        eventName = this.normalizeEventName( eventName )
        this.nativeNode().detachEvent( eventName, handler )
        return this
    } )
    
    $jin.method( '$jin.dom..scream', '$jin.dom.ms..scream', function( event ){
        event = $jin.dom.event( event )
        var eventName = this.normalizeEventName( event.type() )
        this.nativeNode().fireEvent( eventName, event.nativeEvent() )
        return this
    } )

    $jin.method( '$jin.dom.ms..normalizeEventName', function( eventName ){
        return /^[a-zA-Z]+$/.test( eventName ) ? 'on' + eventName : 'onbeforeeditfocus'
    } )
    
}
