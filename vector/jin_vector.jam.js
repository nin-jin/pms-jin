$jin.klass({ '$jin.vector': [ '$jin.wrapper' ] })

$jin.method( '$jin.vector..x', function( val ){
	if( !arguments.length ) return this.raw()[0]
	this.raw()[0] = val
	return this
} )

$jin.method( '$jin.vector..y', function( val ){
	if( !arguments.length ) return this.raw()[1]
	this.raw()[1] = val
	return this
} )

$jin.method( '$jin.vector..z', function( val ){
	if( !arguments.length ) return this.raw()[2]
	this.raw()[2] = val
	return this
} )
