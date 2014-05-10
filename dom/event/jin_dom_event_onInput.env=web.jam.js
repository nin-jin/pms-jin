/**
 * @name $jin.dom.event.onInput
 * @class $jin.dom.event.onInput
 * @returns $jin.dom.event.onInput
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onInput': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onInput.type
 * @method type
 * @static
 * @member $jin.dom.event.onInput
 */
$jin.method({ '$jin.dom.event.onInput.type': function( ){
    '$jin.event.type'
    return 'input'
}})

//$jin.method( '$jin.dom.event.listen', '$jin.dom.event.onInput_listen', function( crier, handler ){
//	var crier = $jin.dom( crier )
//	
//	crier.editable( true )
//	
//	return this.$jin.dom.event.listen( crier, handler )
//} )
