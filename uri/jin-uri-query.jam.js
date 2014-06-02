/**
 * @name $jin.uri.query
 * @class $jin.uri.query
 * @mixins $jin.klass
 * @mixins $jin.wrapper
 * @returns $jin.uri.query
 */
$jin.klass({ '$jin.uri.query': [ '$jin.wrapper' ] })

/**
 * @name $jin.uri.query.exec
 * @method exec
 * @member $jin.uri.query
 * @static
 */
$jin.method({ '$jin.uri.query.exec': function( params ){
	if( typeof params === 'string' ){
        var chunkList = params.split( /[;&\n]+/ )
        params = {}
        chunkList.forEach( function( chunk ){
            var values = chunk.split( /[_:=]/ ).map( function( value ){
	            return decodeURIComponent( value.replace( /\+/g, ' ' ) )
            } )
            var key = values.shift()
            params[ key ] = values
        }.bind(this) )
	}
	
	return this['$jin.wrapper.exec']( params )
}})

/**
 * @name $jin.uri.query#toString
 * @method toString
 * @member $jin.uri.query
 */
$jin.method({ '$jin.uri.query..toString': function( syntax ){
	if( !syntax ) syntax = ';='
	
    var chunks = []
	var params = this.raw()
    
	for( var key in params ){
        var chunk = [ key ].concat( params[ key ] )
		.map( function( val ){
			return $jin.uri.escape( val )
		})
		.join( syntax[1] )
        chunks.push( chunk )
    }
    
    return chunks.join( syntax[0] )
}})
