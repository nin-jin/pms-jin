/**
 * @name $jin.list.cast
 * @method cast
 * @member $jin.list
 * @static
 */
$jin.method({ '$jin.list.cast': function( list ){
	if( list instanceof this ) return list
	return this.apply( null, list )
}})

/**
 * @name $jin.list.generate
 * @method generate
 * @member $jin.list
 * @static
 */
$jin.method({ '$jin.list.generate': function( count, make ){
	var list = this( count )
	for( var i = 0; i < count; ++i ) list[ i ] = make( i )
	return list
}})

/**
 * @name $jin.list.isEqual
 * @method isEqual
 * @member $jin.list
 * @static
 */
$jin.method({ '$jin.list.isEqual': function( left, right ){
	if( left.length !== right.length ) return false
	
	for( var i = 0; i < left.length; ++i ){
		if( left[ i ] !== right[ i ] ) return false
	}
	
	return true
}})


/**
 * @name $jin.list#bisect
 * @method bisect
 * @member $jin.list
 */
$jin.method({ '$jin.list..bisect': function( check ){
    var lo = 0
    var hi = this.length
    
    if( !this.length ) return -1
    
    while( lo < hi ){
        var mid = ( lo + hi ) >> 1
        var val = this[ mid ]
        if( check( val ) ) hi = mid
        else lo = mid + 1
    }
    
    return lo
}})

/**
 * @name $jin.list#head
 * @method head
 * @member $jin.list
 */
$jin.method({ '$jin.list..head': function( value ){
	if( !arguments.length ) return this[ 0 ]
	
	this.unshift( value )
	return this
}})

/**
 * @name $jin.list#tail
 * @method tail
 * @member $jin.list
 */
$jin.method({ '$jin.list..tail': function( value ){
	if( !arguments.length ) return this[ this.length - 1 ]
	
	this.push( value )
	return this
}})

/**
 * @name $jin.list#has
 * @method has
 * @member $jin.list
 */
$jin.method({ '$jin.list..has': function( value ){
	return this.indexOf( value ) >= 0
}})

