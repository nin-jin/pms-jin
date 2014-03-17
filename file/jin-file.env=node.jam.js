$jin.method({ '$jin.file': function( path ){
	if( typeof path !== 'string' ) return path
	
	var bestType = $jin.file.base
	
	var types = bestType.descendantClasses()
	.filter( function( type ){
		return type.match( path )
	})
	
	bestType = types[ types.length - 1 ] || bestType
	
	return bestType( path )
}})
