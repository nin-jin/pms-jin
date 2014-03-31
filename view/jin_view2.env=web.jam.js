$jin.klass({ '$jin.view2': [] })

$jin.method( '$jin.view2..state', function( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
} )

$jin.property( '$jin.view2..id', String )

$jin.property( '$jin.view2.htmlID', function( ){
	return String( this ).replace( /\$/, '' ).replace( /\./g, '-' ).toLowerCase()
} )

$jin.method( '$jin.view2..element', function( key ){
	var protoId = this.constructor.htmlID()
	if( key ) protoId += '-' + key
	return this.sample( protoId )
} )

$jin.property.hash( '$jin.view2..sample', { pull: function( type ){
    return $jin.sample( type ).view( this )
} } )

$jin.method( '$jin.view2..nativeNode', function( ){
    return this.element('').nativeNode()
} )

$jin.method( '$jin.view2..clone', function( ){
    return this.constructor()
} )

$jin.method( '$jin.view2..toString', function( ){
    return this.constructor + '=' + this.id()
} )
