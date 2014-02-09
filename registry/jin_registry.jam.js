$jin.property.hash( '$jin.registry.storage', {} )

$jin.property( '$jin.registry..id', String )

$jin.method( '$jin.klass.exec', '$jin.registry.exec', function( id ){
	if( id instanceof this ) return id
	id = String( id )
	
    var obj = id; while( typeof obj === 'string' ) obj = this.storage( obj )
	
    if( obj ) return obj
    
    var newObj = (new this).id( id )
    var id2 = newObj.id()
    
    var obj = this.storage( id2 )
    if( obj ) return obj
    
	if( id !== id2 ) this.storage( id, id2 )
	this.storage( id2, newObj )
	
    return newObj
} )

$jin.method( '$jin.klass..destroy', '$jin.registry..destroy', function( ){
	this.constructor.storage( this.id(), null )
	this['$jin.klass..destroy']()
} )

$jin.method( '$jin.klass..toString', '$jin.registry..toString', function( ){
    return this.id()
} )
