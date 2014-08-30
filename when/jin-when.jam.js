/**
 * @name $jin.when
 * @method when
 * @member $jin
 * @static
 */
$jin.method({ '$jin.when': function( list ){
	
	var response = $jin.atom({})
	var values = []
	var awaitCount = list.length
	
	list.forEach( function( promise, index ){
		var handle = function( value ){
			values[ index ] = value
			if( !--awaitCount ) response.put( values )
		}
		promise.then( handle, handle )
	} )
	
	return response
}})
