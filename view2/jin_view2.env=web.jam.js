/**
 * @name $jin.view2
 * @class $jin.view2
 * @returns $jin.view2
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.view2': [] })

/**
 * @name $jin.view2.exec
 * @method exec
 * @member $jin.view2
 * @static
 */
$jin.method({ '$jin.view2.exec': function( config ){
	if( typeof config === 'string' ) config = { id: config }
	return this[ '$jin.klass.exec' ]( config )
}})

/**
 * @name $jin.view2.sampleProtoId
 * @method sampleProtoId
 * @static
 * @member $jin.view2
 */
$jin.property({ '$jin.view2.sampleProtoId': function( ){
	return String( this ).replace( /\$/, '' ).replace( /\./g, '-' ).toLowerCase()
}})

/**
 * @name $jin.view2#state
 * @method state
 * @member $jin.view2
 */
$jin.method({ '$jin.view2..state': function( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
}})

/**
 * @name $jin.view2#name
 * @method name
 * @member $jin.view2
 */
$jin.property({ '$jin.view2..name': String })

/**
 * @name $jin.view2#id
 * @method id
 * @member $jin.view2
 */
$jin.property({ '$jin.view2..id': function( ){
	var id = this.name()

	var parent = this.parent()
	if( parent ) id = parent.id() + ';' + id

	return id
} })

/**
 * @name $jin.view2#parent
 * @method parent
 * @member $jin.view2
 */
$jin.property({ '$jin.view2..parent': null })

/**
 * @name $jin.view2#element
 * @method element
 * @member $jin.view2
 */
$jin.method({ '$jin.view2..element': function( key ){
	var protoId = this.constructor.sampleProtoId()
	if( key ) protoId += '-' + key
	return this.sample( protoId )
}})

/**
 * @name $jin.view2#sample
 * @method sample
 * @member $jin.view2
 */
$jin.property.hash({ '$jin.view2..sample': {
    pull: function( type ){
        return $jin.sample( type ).view( this )
    }
}})

/**
 * @name $jin.view2#childs
 * @method childs
 * @member $jin.view2
 */
$jin.property.hash({ '$jin.view2..childs': { } })

/**
 * @name $jin.view2#child
 * @method child
 * @member $jin.view2
 */
$jin.method({ '$jin.view2..child': function( name, factory ){
	var child = this.childs( name )
	if( child ) return child
	
	child = factory({ name: name, parent: this })
	this.childs( name, child )
	
	return child
}})

/**
 * @name $jin.view2#nativeNode
 * @method nativeNode
 * @member $jin.view2
 */
$jin.method({ '$jin.view2..nativeNode': function( ){
    return this.element('').nativeNode()
}})

/**
 * @name $jin.view2#toString
 * @method toString
 * @member $jin.view2
 */
$jin.method({ '$jin.view2..toString': function( ){
    return this.constructor + '=' + this.id()
}})

/**
 * @name $jin.view2#destroy
 * @method destroy
 * @member $jin.view2
 */
$jin.method({ '$jin.view2..destroy': function( ){
	//var samples = this.sample()
	//for( var key in samples ) samples[ key ].view( null )
	this['$jin.klass..destroy']()
}})

/**
 * @name $jin.view2#focused
 * @method focused
 * @member $jin.view2
 */
$jin.atom.prop({ '$jin.view2..focused': {
	pull: function( ){
		return null
	},
	push: function( next ){
		var parent = this.parent()
		if( !parent ) return

		parent.focused( next && this.name() )
	}
}})
