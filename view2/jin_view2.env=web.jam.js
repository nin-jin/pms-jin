$jin.klass({ '$jin.view2': [] })

$jin.property( '$jin.view2.sampleProtoId', function( ){
	return String( this ).replace( /\$/, '' ).replace( /\./g, '-' ).toLowerCase()
} )

$jin.method( '$jin.view2..state', function( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
} )

$jin.property( '$jin.view2..id', String )
$jin.property({ '$jin.view2..parent': null })

$jin.method( '$jin.view2..element', function( key ){
	var protoId = this.constructor.sampleProtoId()
	if( key ) protoId += '-' + key
	return this.sample( protoId )
} )

$jin.property.hash( '$jin.view2..sample', { pull: function( type ){
    return $jin.sample( type ).view( this )
} } )

$jin.property.hash( '$jin.view2..childs', { } )

$jin.method( '$jin.view2..child', function( name, factory ){
	var child = this.childs( name )
	if( child ) return child
	
	child = factory({ id: this.id() + ';' + name, parent: this })
	this.childs( name, child )
	
	return child
} )

$jin.method( '$jin.view2..nativeNode', function( ){
    return this.element('').nativeNode()
} )

$jin.method( '$jin.view2..clone', function( ){
    return this.constructor()
} )

$jin.method( '$jin.view2..toString', function( ){
    return this.constructor + '=' + this.id()
} )
