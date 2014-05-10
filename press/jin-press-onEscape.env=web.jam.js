/**
 * @name $jin.press.onEscape
 * @class $jin.press.onEscape
 * @returns $jin.press.onEscape
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.press.onEscape': [ '$jin.dom.event' ] })

/**
 * @name $jin.press.onEscape.type
 * @method type
 * @static
 * @member $jin.press.onEscape
 */
$jin.method({ '$jin.press.onEscape.type': function( ){
    '$jin.event.type'
    return 'keydown'
}})

/**
 * @name $jin.press.onEscape.listen
 * @method listen
 * @static
 * @member $jin.press.onEscape
 */
$jin.method({ '$jin.press.onEscape.listen': function( crier, handler ){
	return this[ '$jin.dom.event.listen' ]( crier, function press_wrapper( event ){
		if( event.keyCode() != 27 ) return
		handler( event )
	} )
}})
