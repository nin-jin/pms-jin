/**
 * @name $jin.vector
 * @class $jin.vector
 * @returns $jin.vector
 * @mixins $jin.klass
 * @mixins $jin.wrapper
 */
$jin.klass({ '$jin.vector': [ '$jin.wrapper' ] })

/**
 * @name $jin.vector#init
 * @method init
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..init': function( data ){
	if( !arguments.length ) data = []
	switch( $jin.type( data ) ){
		case 'Array':
			return this['$jin.wrapper..init']( data )
		case 'Object':
			return this['$jin.wrapper..init']([]).json( data )
	}
	throw new Error( 'Wrong data for vector' )
}})

/**
 * @name $jin.vector#x
 * @method x
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..x': function( val ){
	if( !arguments.length ) return this.raw()[0]
	this.raw()[0] = val
	return this
}})

/**
 * @name $jin.vector#y
 * @method y
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..y': function( val ){
	if( !arguments.length ) return this.raw()[1]
	this.raw()[1] = val
	return this
}})

/**
 * @name $jin.vector#z
 * @method z
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..z': function( val ){
	if( !arguments.length ) return this.raw()[2]
	this.raw()[2] = val
	return this
}})

/**
 * @name $jin.vector.merge
 * @method merge
 * @static
 * @member $jin.vector
 */
$jin.method({ '$jin.vector.merge': function( merger, left, right ){
	left = $jin.vector( left ).raw()
	right = $jin.vector( right ).raw()
	
	var res = left.map( function( l, index ){
		var r = right[ index ]
		return merger( l, r )
	} )
	
	return $jin.vector( res )
}})

/**
 * @name $jin.vector#summ
 * @method summ
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..summ': function( right ){
	return $jin.vector.merge( $jin.merge.summ, this, right )
}})

/**
 * @name $jin.vector#sub
 * @method sub
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..sub': function( right ){
	return $jin.vector.merge( $jin.merge.sub, this, right )
}})

/**
 * @name $jin.vector#mult
 * @method mult
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..mult': function( right ){
	return $jin.vector.merge( $jin.merge.mult, this, right )
}})

/**
 * @name $jin.vector#div
 * @method div
 * @member $jin.vector
 */
$jin.method({ '$jin.vector..div': function( right ){
	return $jin.vector.merge( $jin.merge.div, this, right )
}})
