this.$jin.log = function( ){
	if( typeof console === 'undefined' ) return
	
	console.log.apply( console, arguments )

	return arguments[0]
}

this.$jin.log.info = function( ){
	if( typeof console === 'undefined' ) return
	
	return console.info.apply( console, arguments )
}

this.$jin.log.warn = function( ){
	if( typeof console === 'undefined' ) return
	
	return console.warn.apply( console, arguments )
}

this.$jin.log.error = function( error ){
	if( typeof console === 'undefined' ) return
	
	if( error.jin_log_isLogged ) return
	
	var message = error.stack || error
	
	if( console.exception ) console.exception( error )
	else if( console.error ) console.error( message )
	else if( console.log ) console.log( message )
	
	error.jin_log_isLogged = true
}

this.$jin.log.error.ignore = function( error ){
	error.jin_log_isLogged = true
	return error
}
