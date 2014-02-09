$jin.klass({ '$jin.press.onGoDown': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.press.onGoDown.type', function( ){
    return 'keydown'
} )

$jin.method( '$jin.dom.event.listen', '$jin.press.onGoDown.listen', function( crier, handler ){
	return this[ '$jin.dom.event.listen' ]( crier, function press_wrapper( event ){
		if( event.keyCode() != 40 ) return
		handler( event )
	} )
} ) 
