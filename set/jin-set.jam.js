$jin.klass({ '$jin.set': [ '$jin.list' ] })

$jin.method({ '$jin.set..init': function( raw ){
	raw.forEach( function( value ){
		raw[ '?' + value ] = value
	})
    this['$jin.wrapper..init']( raw )
    return this
}})

$jin.method( '$jin.set..has', function( value ){
	return this.raw()[ '?' + value ] !== void 0
} )


$jin.method( '$jin.set..head', function( value ){
	if( !arguments.length ) this['$jin.list..head']()
	
	var raw = this.raw()
	
	var key = '?' + value
	if( raw[ key ] !== void 0 ) return this
	
	this['$jin.list..head']( value )
	raw[ key ] = value
	
	return this
} )

$jin.method( '$jin.list..spit', function( ){
	var raw = this.raw()
	var value = raw.shift()
	raw[ '?' + value ] === void 0
	return value
} )


$jin.method( '$jin.set..tail', function( value ){
	if( !arguments.length ) this['$jin.list..tail']()
	
	var raw = this.raw()
	
	var key = '?' + value
	if( raw[ key ] !== void 0 ) return this
	
	this['$jin.list..tail']( value )
	raw[ key ] = value
	
	return this
} )

$jin.method( '$jin.list..pop', function( ){
	var raw = this.raw()
	var value = raw.pop()
	raw[ '?' + value ] === void 0
	return value
} )


$jin.method( '$jin.list..drop', function( value ){
	if( !this.has( value ) ) return this
	
	var raw = this.raw()
	var index = raw.indexOf( value )
	
	raw.splice( index, 1 )
	
	return this
} )

$jin.method({ '$jin.list..item': function( index, next ){
	var raw = this.raw()
	
	if( arguments.length < 2 ) return this.raw()[ index ]
	
	var prev = raw[ index ]
	if( prev !== void 0 ) raw[ '?' + prev ] = void 0
	
	raw[ '?' + next ] = next
	raw[ index ] = next
	
	return this
}})
