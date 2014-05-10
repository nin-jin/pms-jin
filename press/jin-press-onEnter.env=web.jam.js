/**
 * @name $jin.press.onEnter
 * @class $jin.press.onEnter
 * @returns $jin.press.onEnter
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.press.onEnter': [ '$jin.dom.event' ] })

/**
 * @name $jin.press.onEnter.type
 * @method type
 * @static
 * @member $jin.press.onEnter
 */
$jin.method({ '$jin.press.onEnter.type': function( ){
    '$jin.event.type'
    return 'keydown'
}})

/**
 * @name $jin.press.onEnter.listen
 * @method listen
 * @static
 * @member $jin.press.onEnter
 */
$jin.method({ '$jin.press.onEnter.listen': function( crier, handler ){
	return this[ '$jin.dom.event.listen' ]( crier, function press_wrapper( event ){
		if( event.keyCode() != 13 ) return
		handler( event )
	} )
}})
