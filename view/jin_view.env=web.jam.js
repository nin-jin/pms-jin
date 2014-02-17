$jin.klass({ '$jin.view': [ '$jin.registry' ] })

$jin.method( '$jin.view..state', function( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
} )

$jin.property.hash( '$jin.view..sample', { pull: function( protoId ){
    var proto = $jin.sample.proto( protoId )
	
	var sample = proto.make( this )
	sample.view( this )
	//this.entangle( sample )
	//sample.activated( true )
	
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
	
	if( val ){
		var samples = this.sample()
		
		for( var protoId in samples ){
			//samples[ protoId ].activated( false )
			samples[ protoId ].view( null ).free()
			this.sample( protoId, void 0 )
		}
	} else {
		var samples = this.sample()
		
		for( var protoId in samples ){
			//samples[ protoId ].activated( true )
		}
	}
	
	return !!val
} )

$jin.method( '$jin.view..nativeNode', function( ){
    return this.element().nativeNode()
} )

$jin.method( '$jin.view..clone', function( id ){
	var Klass = this.constructor
    return Klass( id )
} )

$jin.method( '$jin.view..make', function( postfix, factory ){
    return factory( this.id() + ';' + postfix )
} )
