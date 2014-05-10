/**
 * @name $jin.list
 * @class $jin.list
 * @returns $jin.list
 * @mixins $jin.klass
 * @mixins $jin.wrapper
 */
$jin.klass({ '$jin.list': [ '$jin.wrapper' ] })


/**
 * @name $jin.list#bisect
 * @method bisect
 * @member $jin.list
 */
$jin.method({ '$jin.list..bisect': function( check ){
    var list = this.raw()
    var lo = 0
    var hi = list.length
    
    if( !list.length ) return -1
    
    while( lo < hi ){
        var mid = ( lo + hi ) >> 1
        var val = list[ mid ]
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
	if( !arguments.length ) return this.raw()[ 0 ]
	
	this.raw().unshift( value )
	return this
}})

/**
 * @name $jin.list#pop
 * @method pop
 * @member $jin.list
 */
$jin.method({ '$jin.list..pop': function( value ){
	return this.raw().pop( index )
}})


/**
 * @name $jin.list#tail
 * @method tail
 * @member $jin.list
 */
$jin.method({ '$jin.list..tail': function( value ){
	var raw = this.raw()
	if( !arguments.length ) return raw[ raw.length ]
	
	this.raw().push( value )
	return this
}})

/**
 * @name $jin.list#spit
 * @method spit
 * @member $jin.list
 */
$jin.method({ '$jin.list..spit': function( ){
	return this.raw().shift( value )
}})


/**
 * @name $jin.list#count
 * @method count
 * @member $jin.list
 */
$jin.method({ '$jin.list..count': function(){
	return this.raw().length
}})

/**
 * @name $jin.list#has
 * @method has
 * @member $jin.list
 */
$jin.method({ '$jin.list..has': function( value ){
	return this.raw().indexOf( value ) >= 0
}})

/**
 * @name $jin.list#indexOf
 * @method indexOf
 * @member $jin.list
 */
$jin.method({ '$jin.list..indexOf': function( value ){
	return this.raw().indexOf( value )
}})


/**
 * @name $jin.list#iterate
 * @method iterate
 * @member $jin.list
 */
$jin.method({ '$jin.list..iterate': function( proceed ){
	var raw = this.raw()
	for( var i = 0; i < raw.length; ++i ) proceed( raw[ i ], i )
	return this
}})

/**
 * @name $jin.list#map
 * @method map
 * @member $jin.list
 */
$jin.method({ '$jin.list..map': function( mutate ){
	var List = this.constructor
	var result = List( Array( this.count() ) )
	this.iterate( function jin_list_mapOne( item, index ){
		result.item( index, mutate( item ) )
	} )
	return result
}})

/**
 * @name $jin.list#filter
 * @method filter
 * @member $jin.list
 */
$jin.method({ '$jin.list..filter': function( proceed ){
	var wrap = this.constructor
	return wrap( this.raw().filter( proceed ) )
}})

/**
 * @name $jin.list#slice
 * @method slice
 * @member $jin.list
 */
$jin.method({ '$jin.list..slice': function( from, to ){
	return this.raw().slice( from, to )
}})
