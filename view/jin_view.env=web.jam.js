/**
 * @name $jin.view
 * @class $jin.view
 * @returns $jin.view
 * @mixins $jin.klass
 * @mixins $jin.registry
 * @mixins $jin.pool
 */
$jin.klass({ '$jin.view': [ '$jin.registry'/*, '$jin.pool'*/ ] })

/**
 * @name $jin.view#state
 * @method state
 * @member $jin.view
 */
$jin.method({ '$jin.view..state': function( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
}})

/**
 * @name $jin.view#sample
 * @method sample
 * @member $jin.view
 */
$jin.property.hash({ '$jin.view..sample': {
    pull: function( type ){
        return $jin.sample( type ).view( this )
    }
}})

/**
 * @name $jin.view#htmlID
 * @method htmlID
 * @member $jin.view
 */
$jin.property({ '$jin.view..htmlID': function( ){
	return String( this.constructor ).replace( /^\$/, '' ).replace( /\./g, '-' ).toLowerCase()
}})

/**
 * @name $jin.view#element
 * @method element
 * @member $jin.view
 */
$jin.method({ '$jin.view..element': function( key ){
	var protoId = this.htmlID()
	if( key ) protoId += '-' + key
	return this.sample( protoId )
}})

/**
 * @name $jin.view#nativeNode
 * @method nativeNode
 * @member $jin.view
 */
$jin.method({ '$jin.view..nativeNode': function( ){
    return this.element().nativeNode()
}})

/**
 * @name $jin.view#clone
 * @method clone
 * @member $jin.view
 */
$jin.method({ '$jin.view..clone': function( id ){
	var Klass = this.constructor
    return Klass( id )
}})

/**
 * @name $jin.view#make
 * @method make
 * @member $jin.view
 */
$jin.method({ '$jin.view..make': function( postfix, factory ){
    return factory( this.id() + ';' + postfix )
}})

/**
 * @name $jin.view#destroy
 * @method destroy
 * @member $jin.view
 */
$jin.method({ '$jin.view..destroy': function( ){
	var samples = this.sample()
	for( var key in samples ) samples[ key ].view( null )
	this['$jin.registry..destroy']()
}})
