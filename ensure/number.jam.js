/**
 * @name $jin.ensure.number.range
 * @method range
 * @member $jin.ensure.number
 * @static
 */
$jin.method({ '$jin.ensure.number.range': function( min, max ){
	if( min == null ) min = Number.NEGATIVE_INFINITY
	if( max == null ) max = Number.POSITIVE_INFINITY
	return function( value ){
		if( !arguments.length ) return
		var norm = Number( value )
		if( norm >= min && norm <= max ) return norm
		throw new Error( 'Value must be in range (' + min + '..' + max + ') but given (' + value + ')' )
	}
} })