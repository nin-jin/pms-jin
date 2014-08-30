/**
 * @name $jin.press.onGoLeft
 * @class $jin.press.onGoLeft
 * @returns $jin.press.onGoLeft
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.press.onGoLeft': [ '$jin.dom.event' ] })

/**
 * @name $jin.press.onGoLeft.type
 * @method type
 * @static
 * @member $jin.press.onGoLeft
 */
$jin.method({ '$jin.press.onGoLeft.type': function( ){
    this['$jin.event.type']
    return 'keydown'
}})

/**
 * @name $jin.press.onGoLeft.listen
 * @method listen
 * @static
 * @member $jin.press.onGoLeft
 */
$jin.method({ '$jin.press.onGoLeft.listen': function( crier, handler ){
	return this[ '$jin.dom.event.listen' ]( crier, function press_wrapper( event ){
		if( event.keyCode() != 37 ) return
		handler( event )
	} )
}})
