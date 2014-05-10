/**
 * @name $jin.klass
 * @method klass
 * @static
 * @member $jin
 */
$jin.definer({ '$jin.klass': function( path, mixins ){
    mixins.unshift( '$jin.klass' )
    var klass = $jin.mixin( path, mixins )
	return klass
}})

/**
 * @name $jin.klass.klass
 * @method klass
 * @static
 * @member $jin.klass
 */
$jin.konst({ '$jin.klass.klass': function( ){
	var klass = function Instance( ){ }
	klass.prototype = this.prototype
	return klass
}})

/**
 * @name $jin.klass.exec
 * @method exec
 * @static
 * @member $jin.klass
 */
$jin.method({ '$jin.klass.exec': function( ){
	var klass = this.klass()
	var obj = new klass
	obj.init.apply( obj, arguments )
	return obj
}})

/**
 * @name $jin.klass.descendantClasses
 * @method descendantClasses
 * @static
 * @member $jin.klass
 */
$jin.property({ '$jin.klass.descendantClasses': function( ){ // TODO: use atoms!
	var paths = this.jin_mixin_slaveList || []
	var lists = paths.map( function( path ){
		var klass = $jin.glob( path )
		return klass.descendantClasses()
	} )
	return [].concat.apply( [ this ], lists )
}})

/**
 * @name $jin.klass.subClass
 * @method subClass
 * @static
 * @member $jin.klass
 */
$jin.method({ '$jin.klass.subClass': function( fields ){
	var klass = $jin.trait.make()
	for( var key in this ) klass[ key ] = this[ key ]
	var proto = klass.prototype = Object.create( this.prototype )
	for( var key in fields ) proto[ key ] = fields[ key ]
	return klass
}})

/**
 * @name $jin.klass.id
 * @method id
 * @static
 * @member $jin.klass
 */
$jin.method({ '$jin.klass.id': function( ){
    return this.displayName || this.name
}})

/**
 * @name $jin.klass.toString
 * @method toString
 * @static
 * @member $jin.klass
 */
$jin.method({ '$jin.klass.toString': function( ){
    return this.id()
}})

/**
 * @name $jin.klass#init
 * @method init
 * @member $jin.klass
 */
$jin.method({ '$jin.klass..init': function( json ){
    return this.json( json )
}})

/**
 * @name $jin.klass#entangleList
 * @method entangleList
 * @member $jin.klass
 */
$jin.property({ '$jin.klass..entangleList': Array })

/**
 * @name $jin.klass#entangle
 * @method entangle
 * @member $jin.klass
 */
$jin.method({ '$jin.klass..entangle': function( value ){
    this.entangleList().push( value )
    return value
}})

/**
 * @name $jin.klass#destroy
 * @method destroy
 * @member $jin.klass
 */
$jin.method({ '$jin.klass..destroy': function( ){
    
    this.entangleList().forEach( function( entangle ){
       entangle.destroy()
    } )
    
    for( var key in this ){
        delete this[ key ]
    }
    
    return this
}})

/**
 * @name $jin.klass#json
 * @method json
 * @member $jin.klass
 */
$jin.method({ '$jin.klass..json': function( json ){
    if( !arguments.length ) return null
    
    if( !json ) return this
    
    for( var key in json ){
        this[ key ]( json[ key ] )
    }
    
    return this
}})

/**
 * @name $jin.klass#methodList
 * @method methodList
 * @member $jin.klass
 */
$jin.property({ '$jin.klass..methodList': Object })

/**
 * @name $jin.klass#method
 * @method method
 * @member $jin.klass
 */
$jin.method({ '$jin.klass..method': function( name ){
    var hash = this.methodHash()
    
    var method = hash[ '_' + name ]
    if( method ) return method
    
    method = function( ){
        return method.content[ method.methodName ].call( method.content, arguments )
    }
    
    return hash[ '_' + name ] = method
}})
