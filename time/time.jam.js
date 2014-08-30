/**
 * @name $jin.time.exec
 * @method exec
 * @member $jin.time
 * @static
 */
$jin.method({ '$jin.time.exec': function( time ){
	if( !arguments.length ) return $jin.time.moment()
	switch( $jin.type( time ) ){
		case 'Number':
		case 'Date':
			return $jin.time.moment( time )
		case 'String':
			if( /^[P+-]/i.test( time ) ) return $jin.time.period( time )
			return $jin.time.moment( time )
		default:
			throw new Error( 'Wrong type of time (' + $jin.type( time ) + ')' )
	}
}})
