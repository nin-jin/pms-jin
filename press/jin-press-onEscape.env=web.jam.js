$jin.klass({ '$jin.press.onEscape': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.press.onEscape.type', function( ){
    return 'keydown'
} )

$jin.method( '$jin.dom.event.listen', '$jin.press.onEscape.listen', function( crier, handler ){
	return this[ '$jin.dom.event.listen' ]( crier, function press_wrapper( event ){
		if( event.keyCode() != 27 ) return
		handler( event )
	} )
} ) 
