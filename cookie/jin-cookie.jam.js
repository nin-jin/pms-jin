/**
 * @name $jin.cookie
 * @method cookie
 * @member $jin
 * @static
 */
$jin.method({ '$jin.cookie': function( name, config ){
	if( arguments.length > 1 ){
		var query = {}
		query[ name ] = config.birthDay
		document.cookie = $jin.uri({ query : query }).toString().substring( 1 )
		return config.birthDay
	}
	var cookies = $jin.uri.parse( '?' + document.cookie.replace( /; /g, '&' ) ).query()
	if( arguments.length < 1 ) return cookies
	return cookies[ name ]
}})
