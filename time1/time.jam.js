/**
 * @name $jin.time1.exec
 * @method exec
 * @member $jin.time
 * @static
 */
$jin.method({ '$jin.time1.exec': function( time ){
	if( !arguments.length ) return $jin.time1.moment()
	switch( $jin_type( time ) ){
		case 'Number':
		case 'Date':
			return $jin.time1.moment( time )
		case 'String':
			if( /^[P+-]/i.test( time ) ) return $jin.time1.period( time )
			return $jin.time1.moment( time )
		default:
			throw new Error( 'Wrong type of time (' + $jin_type( time ) + ')' )
	}
}})
