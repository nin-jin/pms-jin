/**
 * @name $jin.dom#html
 * @method html
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..html': function( html ){
    if( arguments.length ){
        this.nativeNode().innerHTML = html
        return this
    } else {
        return this.nativeNode().innerHTML
    }
}})

/**
 * @name $jin.dom#size
 * @method size
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..size': function( ){
	var node = this.nativeNode()
	return $jin.vector([ node.offsetWidth, node.ofsfetHeight ])
}})

if( $jin.support.xmlModel() === 'ms' ){
    
    $jin.mixin({ '$jin.dom': [ '$jin.dom.ms' ] })
    
    /**
     * @name $jin.dom.ms#toString
     * @method toString
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..toString': function( ){
        this['$jin.dom..toString']
        return String( this.nativeNode().xml )
    }})

    /**
     * works incorrectly =( use render instead
     * @name $jin.dom.ms#transform
     * @method transform
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..transform': function( stylesheet ){
        this['$jin.dom..transform']
        var result= this.nativeNode().transformNode( $jin.dom( stylesheet ).nativeNode() )
        return $jin.dom.parse( result )
    }})

    /**
     * @name $jin.dom.ms#render
     * @method render
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..render': function( from, to ){
        this['$jin.dom..render']
        from = $jin.dom( from ).nativeNode()
        to = $jin.dom( to ).nativeNode()
        
        to.innerHTML= from.transformNode( this.nativeDoc() )
    }})
    
    /**
     * @name $jin.dom.ms#select
     * @method select
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..select': function( xpath ){
        this['$jin.dom..select']
        var list= []
        
        var found= this.nativeNode().selectNodes( xpath )
        for( var i= 0; i < found.length; ++i ) list.push( $jin.dom( found[ i ] ) )
        
        return list
    }})

}

if( $jin.support.eventModel() === 'ms' ){

    /**
     * @name $jin.dom.ms#listen
     * @method listen
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..listen': function( eventName, handler ){
        this['$jin.dom..listen']
        eventName = this.normalizeEventName( eventName )
        this.nativeNode().attachEvent( eventName, function( ){
            var event = $jin.dom.event( window.event )
            //if( event.type() !== eventName ) return
            return handler( event )
        } )
        return this
    }})
    
    /**
     * @name $jin.dom.ms#forget
     * @method forget
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..forget': function( eventName, handler ){
        this['$jin.dom..forget']
        eventName = this.normalizeEventName( eventName )
        this.nativeNode().detachEvent( eventName, handler )
        return this
    }})
    
    /**
     * @name $jin.dom.ms#scream
     * @method scream
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..scream': function( event ){
        this['$jin.dom..scream']
        event = $jin.dom.event( event )
        var eventName = this.normalizeEventName( event.type() )
        this.nativeNode().fireEvent( eventName, event.nativeEvent() )
        return this
    }})

    /**
     * @name $jin.dom.ms#normalizeEventName
     * @method normalizeEventName
     * @member $jin.dom.ms
     */
    $jin.method({ '$jin.dom.ms..normalizeEventName': function( eventName ){
        return /^[a-zA-Z]+$/.test( eventName ) ? 'on' + eventName : 'onbeforeeditfocus'
    }})
    
}
