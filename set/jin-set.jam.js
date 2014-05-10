/**
 * @name $jin.set
 * @class $jin.set
 * @returns $jin.set
 * @mixins $jin.klass
 * @mixins $jin.list
 */
$jin.klass({ '$jin.set': [ '$jin.list' ] })

/**
 * @name $jin.set#init
 * @method init
 * @member $jin.set
 */
$jin.method({ '$jin.set..init': function( raw ){
	raw.forEach( function( value ){
		raw[ '?' + value ] = value
	})
    this['$jin.wrapper..init']( raw )
    return this
}})

/**
 * @name $jin.set#has
 * @method has
 * @member $jin.set
 */
$jin.method({ '$jin.set..has': function( value ){
	return this.raw()[ '?' + value ] !== void 0
}})


/**
 * @name $jin.set#head
 * @method head
 * @member $jin.set
 */
$jin.method({ '$jin.set..head': function( value ){
	if( !arguments.length ) this['$jin.list..head']()
	
	var raw = this.raw()
	
	var key = '?' + value
	if( raw[ key ] !== void 0 ) return this
	
	this['$jin.list..head']( value )
	raw[ key ] = value
	
	return this
}})

/**
 * @name $jin.set#spit
 * @method spit
 * @member $jin.set
 */
$jin.method({ '$jin.set..spit': function( ){
    '$jin.list..spit'
	var raw = this.raw()
	var value = raw.shift()
	raw[ '?' + value ] === void 0
	return value
}})


/**
 * @name $jin.set#tail
 * @method tail
 * @member $jin.set
 */
$jin.method({ '$jin.set..tail': function( value ){
	if( !arguments.length ) this['$jin.list..tail']()
	
	var raw = this.raw()
	
	var key = '?' + value
	if( raw[ key ] !== void 0 ) return this
	
	this['$jin.list..tail']( value )
	raw[ key ] = value
	
	return this
}})

/**
 * @name $jin.set#pop
 * @method pop
 * @member $jin.set
 */
$jin.method({ '$jin.set..pop': function( ){
    '$jin.list..pop'
	var raw = this.raw()
	var value = raw.pop()
	raw[ '?' + value ] === void 0
	return value
}})

/**
 * @name $jin.set#item
 * @method item
 * @member $jin.set
 */
$jin.method({ '$jin.set..item': function( index, next ){
    '$jin.list..item'
	var raw = this.raw()
	
	if( arguments.length < 2 ) return this.raw()[ index ]
	
	var prev = raw[ index ]
	if( prev !== void 0 ) raw[ '?' + prev ] = void 0
	
	raw[ '?' + next ] = next
	raw[ index ] = next
	
	return this
}})
