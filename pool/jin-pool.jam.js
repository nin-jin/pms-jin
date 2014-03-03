/**
 * Pool trait.
 * http://en.wikipedia.org/wiki/Object_pool_pattern
 */
$jin.klass({ '$jin.pool': [] })

/**
 * Storage of waiting instances
 */
$jin.property({ '$jin.pool.pool': function( ){
	return []
}})

/**
 * Reinitialize and return object from pool.
 * Otherwise create new one.
 */
$jin.method({ '$jin.pool.exec': function( ){
	var obj = this.pool().pop()
	if( !obj ) return this['$jin.klass.exec'].apply( this, arguments )
	
	obj.init.apply( obj, arguments )
	return obj
}})

/**
 * Store instance in pool instead destroying
 */
$jin.method({ '$jin.pool..destroy': function( ){
	this['$jin.klass..destroy']
	this.constructor.pool().push( this )
	return this
}})
