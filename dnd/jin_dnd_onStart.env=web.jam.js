$jin.klass({ '$jin.dnd.onStart': [ '$jin.dnd.event' ] })

$jin.method( '$jin.event.type', '$jin.dnd.onStart.type', function( ){
    return 'dragstart'
} )

$jin.method( '$jin.dom.event.listen', '$jin.dnd.onStart.listen', function( crier, handler ){
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
} )
