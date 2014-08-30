/**
 * @name $jin.dnd.event
 * @class $jin.dnd.event
 * @returns $jin.dnd.event
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dnd.event': [ '$jin.dom.event' ] })

/**
 * @name $jin.dnd.event#view
 * @method view
 * @member $jin.dnd.event
 */
$jin.method({ '$jin.dnd.event..view': function( dom, x, y ){

	dom = $jin.dom( dom || '<div></div>' )
	dom.parent( document.body )
	dom.nativeNode().style.position = 'absolute'
	dom.nativeNode().style.zIndex = '-1'
	
	var transfer = this.transfer()
	var node = dom.nativeNode()
	try {
		transfer.setDragImage( node, x, y )
	} catch( e ){ }
	
	$jin.schedule( 0, function(){
		dom.parent( null )
	})

	return this
}})

/**
 * @name $jin.dnd.event#effect
 * @method effect
 * @member $jin.dnd.event
 */
$jin.method({ '$jin.dnd.event..effect': function( effect ){
	if( !arguments.length ) return this.transfer().dropEffect

	if( !/^(none|copy|move|link)$/.test( effect ) ){
		throw new Error( 'Wrong dnd effect (' + effect + ')' )
	}

	this.transfer().dropEffect = effect
}})

/**
 * @name $jin.dnd.event#effectAllowed
 * @method effectAllowed
 * @member $jin.dnd.event
 */
$jin.method({ '$jin.dnd.event..effectAllowed': function( effectAllowed ){
	if( !arguments.length ) return this.transfer().effectAllowed

	if( !/^(none|copy|move|link|copyMove|copyLink|linkMove|all)$/.test( effectAllowed ) ){
		throw new Error( 'Wrong dnd effectAllowed (' + effectAllowed + ')' )
	}

	this.transfer().effectAllowed = effectAllowed
}})
