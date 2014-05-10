/**
 * @name $jin.press.onGoUp
 * @class $jin.press.onGoUp
 * @returns $jin.press.onGoUp
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.press.onGoUp': [ '$jin.dom.event' ] })

/**
 * @name $jin.press.onGoUp.type
 * @method type
 * @static
 * @member $jin.press.onGoUp
 */
$jin.method({ '$jin.press.onGoUp.type': function( ){
    '$jin.event.type'
    return 'keydown'
}})

/**
 * @name $jin.press.onGoUp.listen
 * @method listen
 * @static
 * @member $jin.press.onGoUp
 */
$jin.method({ '$jin.press.onGoUp.listen': function( crier, handler ){
	return this[ '$jin.dom.event.listen' ]( crier, function press_wrapper( event ){
		if( event.keyCode() != 38 ) return
		handler( event )
	} )
}})
