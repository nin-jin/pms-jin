$jin.klass({ '$jin.press.onGoUp': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.press.onGoUp.type', function( ){
    return 'keydown'
} )

$jin.method( '$jin.dom.event.listen', '$jin.press.onGoUp.listen', function( crier, handler ){
	return this[ '$jin.dom.event.listen' ]( crier, function press_wrapper( event ){
		if( event.keyCode() != 38 ) return
		handler( event )
	} )
} ) 
