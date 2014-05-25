/**
 * @name $jin.ensure.string.paddedLeft
 * @method paddedLeft
 * @member $jin.ensure.string
 * @static
 */
$jin.method({ '$jin.ensure.string.paddedLeft': function( count, letter ){
	if( !letter ) letter = ' '
	return function( value ){
		value = String( value )
		while( value.length < count ) value = letter + value
		return value
	}
}})

/**
 * @name $jin.ensure.string.lowerCase
 * @method lowerCase
 * @member $jin.ensure.string
 * @static
 */
$jin.method({ '$jin.ensure.string.lowerCase': function( ){
	return function( str ){
		return String( str ).toLowerCase()
	}
}})
