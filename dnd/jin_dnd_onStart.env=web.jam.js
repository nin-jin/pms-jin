/**
 * @name $jin.dnd.onStart
 * @class $jin.dnd.onStart
 * @returns $jin.dnd.onStart
 * @mixins $jin.klass
 * @mixins $jin.dnd.event
 */
$jin.klass({ '$jin.dnd.onStart': [ '$jin.dnd.event' ] })

/**
 * @name $jin.dnd.onStart.type
 * @method type
 * @static
 * @member $jin.dnd.onStart
 */
$jin.method({ '$jin.dnd.onStart.type': function( ){
    this['$jin.event.type']
    return 'dragstart'
}})

/**
 * @name $jin.dnd.onStart.listen
 * @method listen
 * @static
 * @member $jin.dnd.onStart
 */
$jin.method({ '$jin.dnd.onStart.listen': function( crier, handler ){
    this['$jin.dom.event.listen']
	var crier = $jin.dom( crier )
	
	crier.nativeNode().draggable = true
	
    var onStart = crier.listen( 'dragstart', function( event ){
		return handler( $jin.dnd.onStart( event ) )
	} )
	
    var onSelectStart = crier.listen( 'selectstart', function( event ){
		event = $jin.dom.event( event )
		
		var node = event.target().nativeNode()
		if( !node.dragDrop ) return
		
		node.dragDrop()
		
		event.catched( true )
	} )
	
    var onEnd = $jin.dnd.onEnd( crier, function( event ){
		event.data( null )
	} )
	
	return { destroy: function(){
		onStart.destroy()
		onSelectStart.destroy()
		onEnd.destroy()
		crier.nativeNode().draggable = false
	}}
}})
