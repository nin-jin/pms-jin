/**
 * @name $jin.press.onGoRight
 * @class $jin.press.onGoRight
 * @returns $jin.press.onGoRight
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.press.onGoRight': [ '$jin.dom.event' ] })

/**
 * @name $jin.press.onGoRight.type
 * @method type
 * @static
 * @member $jin.press.onGoRight
 */
$jin.method({ '$jin.press.onGoRight.type': function( ){
    this['$jin.event.type']
    return 'keydown'
}})

/**
 * @name $jin.press.onGoRight.listen
 * @method listen
 * @static
 * @member $jin.press.onGoRight
 */
$jin.method({ '$jin.press.onGoRight.listen': function( crier, handler ){
	return this[ '$jin.dom.event.listen' ]( crier, function press_wrapper( event ){
		if( event.keyCode() != 39 ) return
		handler( event )
	} )
}})
