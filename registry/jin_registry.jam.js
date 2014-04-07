/**
 * Registry of singletons trait.
 * http://en.wikipedia.org/wiki/Multiton_pattern
 * Can be mixed with jin-pool trait.
 */

/**
 * Hash map of created instances.
 */
$jin.property.hash( '$jin.registry.storage', {} )

/**
 * Select instance from registry.
 * Otherwise creats new one.
 */
$jin.method( '$jin.klass.exec', '$jin.registry.exec', function( id ){
	if( !arguments.length ) return this['$jin.klass.exec']()
	
	if( id instanceof this ) return id
	id = String( id )
	
    var obj = id; while( typeof obj === 'string' ) obj = this.storage( obj )
	
    if( obj ) return obj
    
	var make = this['$jin.pool.exec'] || this['$jin.klass.exec']
	
    var newObj = make.call( this, { id: id } )
    var id2 = String( newObj.id() )
    
	if( id !== id2 ){
		var obj = this.storage( id2 )
		if( obj ) return obj
		this.storage( id, id2 )
	}
	
	this.storage( id2, newObj )
	
    return newObj
} )

/**
 * Identifier of instance.
 */
$jin.property( '$jin.registry..id', String )

/**
 * Removes from registry on destroy.
 */
$jin.method( '$jin.klass..destroy', '$jin.registry..destroy', function( ){
	this.constructor.storage( this.id(), null )
	var destroy = this['$jin.pool..destroy'] || this['$jin.klass..destroy']
	destroy.call( this )
} )

/**
 * Identifier as primitive representation.
 */
$jin.method( '$jin.klass..toString', '$jin.registry..toString', function( ){
    return this.id()
} )
