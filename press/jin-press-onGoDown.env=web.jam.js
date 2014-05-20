/**
 * @name $jin.press.onGoDown
 * @class $jin.press.onGoDown
 * @returns $jin.press.onGoDown
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.press.onGoDown': [ '$jin.dom.event' ] })

/**
 * @name $jin.press.onGoDown.type
 * @method type
 * @static
 * @member $jin.press.onGoDown
 */
$jin.method({ '$jin.press.onGoDown.type': function( ){
    this['$jin.event.type']
    return 'keydown'
}})

/**
 * @name $jin.press.onGoDown.listen
 * @method listen
 * @static
 * @member $jin.press.onGoDown
 */
$jin.method({ '$jin.press.onGoDown.listen': function( crier, handler ){
	return this[ '$jin.dom.event.listen' ]( crier, function press_wrapper( event ){
		if( event.keyCode() != 40 ) return
		handler( event )
	} )
}})
