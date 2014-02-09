$jin.klass({ '$jin.view': [ '$jin.registry' ] })

$jin.method( '$jin.view..state', function( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
} )

$jin.property.hash( '$jin.view..sample', { pull: function( protoId ){
    var proto = $jin.sample.proto( protoId )
	
	var sample = proto.make( this )
	this.entangle( sample )
	sample.activated( true )
	
    return sample
} } )

$jin.property( '$jin.view..htmlID', function( ){
	return String( this.constructor ).replace( /^\$/, '' ).replace( /\./g, '-' ).toLowerCase()
} )

$jin.method( '$jin.view..element', function( key ){
	var protoId = this.htmlID()
	if( key ) protoId += '-' + key
	return this.sample( protoId )
} )

$jin.property( '$jin.view..freezed', function( val ){
    if( !arguments.length ) return true
	
	var samples = this.sample()
	
	for( var protoId in samples ){
		samples[ protoId ].activated( !val )
	}
	
	return !!val
} )

$jin.property( '$jin.view..nativeNode', function( node ){
    return this.element().nativeNode()
} )

$jin.method( '$jin.view..clone', function( id ){
	var Klass = this.constructor
    return Klass( id )
} )

$jin.method( '$jin.view..make', function( postfix, factory ){
    return factory( this.id() + ';' + postfix )
} )
