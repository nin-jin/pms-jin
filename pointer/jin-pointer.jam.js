/**
 * @name $jin.pointer.listener
 * @method listener
 * @member $jin.pointer
 * @static
 */
$jin.property({ '$jin.pointer.listener': function( ){
	var handler = this.onChange.bind( this )
	$jin.doc().listen( 'mousemove', handler )
	$jin.doc().listen( 'dragover', handler )
	return null
}})

/**
 * @name $jin.pointer.onChange
 * @method onChange
 * @member $jin.pointer
 * @static
 */
$jin.method({ '$jin.pointer.onChange': function( event ){
	this.lastEvent( $jin.dom.event( event ) )
}})

/**
 * @name $jin.pointer.lastEvent
 * @method lastEvent
 * @member $jin.pointer
 * @static
 */
$jin.atom1.prop({ '$jin.pointer.lastEvent': {
	pull: function(){
		this.listener();
	},
	merge: function( next, prev ){
		if( !prev ) return next
		if( next.nativeEvent() === prev.nativeEvent() ) return prev
		return next
	}
}})

/**
 * @name $jin.pointer.target
 * @method target
 * @member $jin.pointer
 * @static
 */
$jin.atom1.prop({ '$jin.pointer.target': {
	pull: function( ){
		var event = this.lastEvent()
		if( !event ) return event
		
		return event.target()
	}
}})

/**
 * @name $jin.pointer.offset
 * @method offset
 * @member $jin.pointer
 * @static
 */
$jin.atom1.prop({ '$jin.pointer.offset': {
	pull: function( ){
		var event = this.lastEvent()
		if( !event ) return event

		return event.pos()
	}
}})
