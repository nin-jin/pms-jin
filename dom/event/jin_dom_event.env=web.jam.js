/**
 * @name $jin.dom.event
 * @class $jin.dom.event
 * @returns $jin.dom.event
 * @mixins $jin.klass
 * @mixins $jin.wrapper
 * @mixins $jin.event
 */
$jin.klass({ '$jin.dom.event': [ '$jin.wrapper', '$jin.event' ] })

/**
 * @name $jin.dom.event.bubbles
 * @method bubbles
 * @static
 * @member $jin.dom.event
 */
$jin.property({ '$jin.dom.event.bubbles': Boolean })

/**
 * @name $jin.dom.event.cancelable
 * @method cancelable
 * @static
 * @member $jin.dom.event
 */
$jin.property({ '$jin.dom.event.cancelable': Boolean })

/**
 * @name $jin.dom.event.listen
 * @method listen
 * @static
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event.listen': function( crier, handler ){
	crier = $jin.dom( crier )
    return this[ '$jin.event.listen' ]( crier, handler )
}})

/**
 * @name $jin.dom.event#nativeEvent
 * @method nativeEvent
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..nativeEvent': function( ){
    var raw = this.raw()
    if( raw ) return raw
    
    var Event = this.constructor 
    var type = Event.type()
    var bubbles = Event.bubbles()
    var cancelable = Event.cancelable()
    
    if( $jin.support.eventModel() === 'ms' ){
        raw= document.createEventObject()
        raw.type = type
        raw.bubbles = bubbles
        raw.cancelable = cancelable
    } else {
        raw = document.createEvent( 'Event' )
        raw.initEvent( type, bubbles, cancelable )
    }
    
    this.raw( raw )
    
    return raw
}})

/**
 * @name $jin.dom.event#target
 * @method target
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..target': function( ){
    this['$jin.event..target']
    return $jin.dom( this.nativeEvent().target || this.nativeEvent().srcElement )
}})

/**
 * @name $jin.dom.event#type
 * @method type
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..type': function( type ){
    this['$jin.event..type']
    var nativeEvent = this.nativeEvent()
    type = String( type )
    
    if( !arguments.length ){
        return nativeEvent.$jin_dom_event_type || nativeEvent.type
    }
    
    nativeEvent.initEvent( type, this.bubbles(), this.cancelable() )
    nativeEvent.$jin_dom_event_type= nativeEvent.type= type
    
    return this
}})

/**
 * @name $jin.dom.event#bubbles
 * @method bubbles
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..bubbles': function( bubbles ){
    var nativeEvent = this.nativeEvent()
    
    if( !arguments.length ){
        return nativeEvent.bubbles
    }
    
    nativeEvent.initEvent( this.type(), Boolean( bubbles ), this.cancelable() )
    
    return this
}})

/**
 * @name $jin.dom.event#cancelable
 * @method cancelable
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..cancelable': function( cancelable ){
    var nativeEvent = this.nativeEvent()
    
    if( !arguments.length ){
        return nativeEvent.cancelable
    }
    
    nativeEvent.initEvent( this.type(), this.bubbles(), Boolean( cancelable ) )
    
    return this
}})

/**
 * @name $jin.dom.event#catched
 * @method catched
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..catched': function( catched ){
    this['$jin.event..catched']
    var nativeEvent = this.nativeEvent()
    
    if( !arguments.length ){
        return nativeEvent.defaultPrevented || nativeEvent.$jin_dom_event_catched || ( nativeEvent.returnValue === false )
    }
    
    nativeEvent.returnValue= !catched
    
    if( catched && nativeEvent.preventDefault ){
        nativeEvent.preventDefault()
    }
    
    nativeEvent.$jin_dom_event_catched = nativeEvent.defaultPrevented = !!catched
    
    return this
}})

/**
 * @name $jin.dom.event#keyCode
 * @method keyCode
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..keyCode': function( ){
    return this.nativeEvent().keyCode
}})

/**
 * @name $jin.dom.event#modCtrl
 * @method modCtrl
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..modCtrl': function( ){
	var nativeEvent = this.nativeEvent()
    return nativeEvent.ctrlKey || nativeEvent.metaKey
}})

/**
 * @name $jin.dom.event#modAlt
 * @method modAlt
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..modAlt': function( ){
    return this.nativeEvent().altKey
}})

/**
 * @name $jin.dom.event#modShift
 * @method modShift
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..modShift': function( ){
    return this.nativeEvent().shiftKey
}})

/**
 * @name $jin.dom.event#mouseButton
 * @method mouseButton
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..mouseButton': function( ){
    return this.nativeEvent().button
}})

/**
 * @name $jin.dom.event#transfer
 * @method transfer
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..transfer': function( ){
    return this.nativeEvent().dataTransfer
}})

/**
 * @name $jin.dom.event#data
 * @method data
 * @member $jin.dom.event
 */
$jin.property({ '$jin.dom.event..data': function( data ){
	function encode( data ){
		var str = JSON.stringify( data )
		var res = ''
		for( var i = 0; i < str.length; ++i ){
			var code = str.charCodeAt(i)
			res += '\\u'
			res += ( ( code >> 12 ) % 16 ).toString( 16 )
			res += ( ( code >> 8 ) % 16 ).toString( 16 )
			res += ( ( code >> 4 ) % 16 ).toString( 16 )
			res += ( code % 16 ).toString( 16 )
		}
		return res
	}
	
	function decode( str ){
		return JSON.parse( JSON.parse( '"' + str + '"' ) )
	}
	
	var transfer = this.transfer()
	if( arguments.length ){
		var str = encode( data )
		$jin.state.local.item( '$jin.dom.event.data', str )
		
		str = '$jin.dom.event.data:' + str
		//transfer.setData( 'Text', str )
		try {
			transfer.setData( str, '' )
		} catch( error ){ }
		
		return data
	} else {
		var str = transfer.getData( 'Text' )
		if( str ) str = str.split( /^$jin.dom.event.data:/ )[1]
		if( !str ){
			var types = transfer.types
			if( types ) for( var i = 0; i < types.length; ++i ){
				var type = transfer.types[i]
				if( !type ) continue
				str = type.split( /^$jin.dom.event.data:/ )[1]
				if( !str ) continue
			}
		}
		if( !str ) str = $jin.state.local.item( '$jin.dom.event.data' )
		if( !str ) return {}
		return decode( str )
	}
}})

/**
 * @name $jin.dom.event#offset
 * @method offset
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..offset': function( ){
    return $jin.vector([ this.nativeEvent().offsetX, this.nativeEvent().offsetY ])
}})

/**
 * @name $jin.dom.event#pos
 * @method pos
 * @member $jin.dom.event
 */
$jin.method({ '$jin.dom.event..pos': function( ){
    return $jin.vector([ this.nativeEvent().pageX, this.nativeEvent().pageY ])
}})
