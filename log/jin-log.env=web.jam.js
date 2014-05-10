/**
 * @name $jin.log
 * @method log
 * @static
 */
$jin.method({ '$jin.log' : function( ){
	if( typeof console === 'undefined' ) return
	
	return console.log.apply( console, arguments )
}})

/**
 * @name $jin.info
 * @method info
 * @static
 */
$jin.method({ '$jin.info' : function( ){
	if( typeof console === 'undefined' ) return
	
	return console.info.apply( console, arguments )
}})

/**
 * @name $jin.warn
 * @method warn
 * @static
 */
$jin.method({ '$jin.warn' : function( ){
	if( typeof console === 'undefined' ) return
	
	return console.warn.apply( console, arguments )
}})

/**
 * @name $jin.log.error
 * @method error
 * @static
 */
$jin.method({ '$jin.log.error' : function( error ){
	if( typeof console === 'undefined' ) return
	
	if( error.jin_log_isLogged ) return
	
	var message = error.stack || error
	
	if( console.exception ) console.exception( error )
	else if( console.error ) console.error( message )
	else if( console.log ) console.log( message )
	
	error.jin_log_isLogged = true
}})

/**
 * @name $jin.log.error.ignore
 * @method ignore
 * @static
 */
$jin.method({ '$jin.log.error.ignore' : function( error ){
	error.jin_log_isLogged = true
	return error
}})
