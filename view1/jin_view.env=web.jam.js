/**
 * @name $jin.view1
 * @class $jin.view1
 * @returns $jin.view1
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.view1': [] })

/**
 * @name $jin.view1.exec
 * @method exec
 * @member $jin.view1
 * @static
 */
$jin.method({ '$jin.view1.exec': function( config ){
	if( typeof config === 'string' ) config = { id: config }
	return this[ '$jin.klass.exec' ]( config )
}})

/**
 * @name $jin.view1.sampleProtoId
 * @method sampleProtoId
 * @static
 * @member $jin.view1
 */
$jin.property({ '$jin.view1.sampleProtoId': function( ){
	return String( this ).replace( /\$/, '' ).replace( /\./g, '-' ).toLowerCase()
}})

/**
 * @name $jin.view1#state
 * @method state
 * @member $jin.view1
 */
$jin.method({ '$jin.view1..state': function( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
}})

/**
 * @name $jin.view1#name
 * @method name
 * @member $jin.view1
 */
$jin.property({ '$jin.view1..name': String })

/**
 * @name $jin.view1#id
 * @method id
 * @member $jin.view1
 */
$jin.property({ '$jin.view1..id': function( ){
	var id = this.name()

	var parent = this.parent()
	if( parent ) id = parent.id() + ';' + id

	return id
} })

/**
 * @name $jin.view1#parent
 * @method parent
 * @member $jin.view1
 */
$jin.property({ '$jin.view1..parent': null })

/**
 * @name $jin.view1#element
 * @method element
 * @member $jin.view1
 */
$jin.method({ '$jin.view1..element': function( key ){
	var protoId = this.constructor.sampleProtoId()
	if( key ) protoId += '-' + key
	return this.sample( protoId )
}})

/**
 * @name $jin.view1#sample
 * @method sample
 * @member $jin.view1
 */
$jin.property.hash({ '$jin.view1..sample': {
    pull: function( type ){
        return $jin.sample( type ).view( this )
    }
}})

/**
 * @name $jin.view1#childs
 * @method childs
 * @member $jin.view1
 */
$jin.property.hash({ '$jin.view1..childs': { } })

/**
 * @name $jin.view1#child
 * @method child
 * @member $jin.view1
 */
$jin.method({ '$jin.view1..child': function( name, factory ){
	var child = this.childs( name )
	if( child ) return child
	
	child = factory({ name: name, parent: this })
	this.childs( name, child )
	
	return child
}})

/**
 * @name $jin.view1#nativeNode
 * @method nativeNode
 * @member $jin.view1
 */
$jin.method({ '$jin.view1..nativeNode': function( ){
    return this.element('').nativeNode()
}})

/**
 * @name $jin.view1#toString
 * @method toString
 * @member $jin.view1
 */
$jin.method({ '$jin.view1..toString': function( ){
    return this.constructor + '=' + this.id()
}})

/**
 * @name $jin.view1#destroy
 * @method destroy
 * @member $jin.view1
 */
$jin.method({ '$jin.view1..destroy': function( ){
	//var samples = this.sample()
	//for( var key in samples ) samples[ key ].view( null )
	this['$jin.klass..destroy']()
}})

/**
 * @name $jin.view1#focused
 * @method focused
 * @member $jin.view1
 */
$jin.atom1.prop({ '$jin.view1..focused': {
	pull: function( ){
		return null
	},
	push: function( next ){
		var parent = this.parent()
		if( !parent ) return

		parent.focused( next && this.name() )
	}
}})
