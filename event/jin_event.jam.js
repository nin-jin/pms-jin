/**
 * @name $jin.event
 * @class $jin.event
 * @returns $jin.event
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.event': [] })

/**
 * @name $jin.event_type
 * @method event_type
 * @static
 * @member $jin
 */
$jin.property({ '$jin.event_type': function( ){
    return String( this )
}})

/**
 * @name $jin.event.listen
 * @method listen
 * @static
 * @member $jin.event
 */
$jin.method({ '$jin.event.listen': function( crier, handler ){
	var ctor = this
	var wrapper = function( event ){
		return handler( ctor( event ) )
	}
    return crier.listen( this.type(), wrapper )
}})


/**
 * @name $jin.event#target
 * @method target
 * @member $jin.event
 */
$jin.property({ '$jin.event..target': null })
/**
 * @name $jin.event#catched
 * @method catched
 * @member $jin.event
 */
$jin.property({ '$jin.event..catched': Boolean })
    
/**
 * @name $jin.event#type
 * @method type
 * @member $jin.event
 */
$jin.property({ '$jin.event..type': function( type ){
    if( arguments.length ) return String( type )
    return String( this.constructor )
}})

/**
 * @name $jin.event#scream
 * @method scream
 * @member $jin.event
 */
$jin.method({ '$jin.event..scream': function( crier ){
    crier.scream( this )
    return this
}})
