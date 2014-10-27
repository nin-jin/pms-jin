/**
 * @name $jin.view
 * @class $jin.view
 * @returns $jin.view
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.view': [] })

/**
 * @name $jin.view.exec
 * @method exec
 * @member $jin.view
 * @static
 */
$jin.method({ '$jin.view.exec': function( config ){
	if( typeof config === 'string' ) config = { id: config }
	return this[ '$jin.klass.exec' ]( config )
}})

/**
 * @name $jin.view.sampleProtoId
 * @method sampleProtoId
 * @static
 * @member $jin.view
 */
$jin.property({ '$jin.view.sampleProtoId': function( ){
	return String( this ).replace( /\$/, '' ).replace( /\./g, '-' ).toLowerCase()
}})

/**
 * @name $jin.view#state
 * @method state
 * @member $jin.view
 */
$jin.method({ '$jin.view..state': function( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
}})

/**
 * @name $jin.view#name
 * @method name
 * @member $jin.view
 */
$jin.property({ '$jin.view..name': String })

/**
 * @name $jin.view#id
 * @method id
 * @member $jin.view
 */
$jin.property({ '$jin.view..id': function( ){
	var id = this.name()

	var parent = this.parent()
	if( parent ) id = parent.id() + ';' + id

	return id
} })

/**
 * @name $jin.view#parent
 * @method parent
 * @member $jin.view
 */
$jin.property({ '$jin.view..parent': null })

/**
 * @name $jin.view#element
 * @method element
 * @member $jin.view
 */
$jin.method({ '$jin.view..element': function( key ){
	var protoId = this.constructor.sampleProtoId()
	if( key ) protoId += '-' + key
	return this.sample( protoId )
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
 * @name $jin.view#childs
 * @method childs
 * @member $jin.view
 */
$jin.property.hash({ '$jin.view..childs': { } })

/**
 * @name $jin.view#child
 * @method child
 * @member $jin.view
 */
$jin.method({ '$jin.view..child': function( name, factory ){
	var child = this.childs( name )
	if( child ) return child
	
	child = factory({ name: name, parent: this })
	this.childs( name, child )
	
	return child
}})

/**
 * @name $jin.view#nativeNode
 * @method nativeNode
 * @member $jin.view
 */
$jin.method({ '$jin.view..nativeNode': function( ){
    return this.element('').nativeNode()
}})

/**
 * @name $jin.view#toString
 * @method toString
 * @member $jin.view
 */
$jin.method({ '$jin.view..toString': function( ){
    return this.constructor + '=' + this.id()
}})

/**
 * @name $jin.view#destroy
 * @method destroy
 * @member $jin.view
 */
$jin.method({ '$jin.view..destroy': function( ){
	//var samples = this.sample()
	//for( var key in samples ) samples[ key ].view( null )
	this['$jin.klass..destroy']()
}})

/**
 * @name $jin.view#focused
 * @method focused
 * @member $jin.view
 */
$jin.atom1.prop({ '$jin.view..focused': {
	pull: function( ){
		return null
	},
	push: function( next ){
		var parent = this.parent()
		if( !parent ) return

		parent.focused( next && this.name() )
	}
}})
