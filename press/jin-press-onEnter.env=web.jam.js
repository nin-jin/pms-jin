$jin.klass({ '$jin.press.onEnter': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.press.onEnter.type', function( ){
    return 'keydown'
} )

$jin.method( '$jin.dom.event.listen', '$jin.press.onEnter.listen', function( crier, handler ){
	return this[ '$jin.dom.event.listen' ]( crier, function press_wrapper( event ){
		if( event.keyCode() != 13 ) return
		handler( event )
	} )
} ) 
