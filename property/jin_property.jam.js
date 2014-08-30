/**
 * @name $jin.property
 * @method property
 * @static
 * @member $jin
 */
$jin.definer({ '$jin.property': function( name, filter ){
    var fieldName = '_' + name
	
	if( filter ){
		var resolveList = filter.jin_method_resolves
		if( !resolveList ){
			resolveList = filter.jin_method_resolves = []
			Object.toString.call( filter ).replace( /['"](\$[.\w]+)['"]/g, function( str, token ){
				if( resolveList.indexOf( token ) >= 0 ) return str
				resolveList.push( token )
			})
		}
		
		var property = function( next ){
			var prev = this[ fieldName ]
			if( arguments.length ){
				if( next === prev ) return this
				if( next === void 0 ){
					this[ fieldName ] = next
				} else {
					this[ fieldName ] = filter.call( this, next )
				}
				return this
			} else {
				if( prev === void 0 ){
					return this[ fieldName ] = filter.call( this )
				} else {
					return prev
				}
			}
		}
	} else {
		var property = function( value ){
			if( arguments.length ){
				this[ fieldName ] = value
				return this
			} else {
				return this[ fieldName ]
			}
		}
	}
    
    property.jin_method_resolves = resolveList
    
    return $jin.method( name, property )
}})

/**
 * @name $jin.property.hash
 * @method hash
 * @static
 * @member $jin.property
 */
$jin.definer({ '$jin.property.hash': function( path, config ){
	var fieldName = '_' + path
	var pull = config.pull || config.sync
	var put = config.put || config.sync
	var push = config.push
	
	var propHash = function( key, value ){
		var storage = this[ fieldName ]
		if( !storage ) storage = this[ fieldName ] = {}
		if( arguments.length > 1 ){
			var value2 = put ? put.call( this, key, value ) : value
			if( value2 === void 0 ) delete storage[ key ]
			else storage[ key ] = value2
			return this
		} else if( arguments.length ) {
			if( typeof key === 'object' ){
				for( var k in key ){
					propHash.call( this, k, key[ k ] )
				}
				return this
			}
			var value2 = storage[ key ]
			if( pull && value2 === void 0 ) value2 = storage[ key ] = pull.call( this, key )
			return value2
		} else {
			return storage
		}
	}
	
	return $jin.method( path, propHash )
}})
