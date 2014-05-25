/**
 * @name $jin.pipe
 * @method pipe
 * @member $jin
 * @static
 */
$jin.method({ '$jin.pipe': function( funcs ){
	switch( funcs.length ){
		case 0: return $jin.pipe.nop
		case 1: return funcs[0]
		default:
			var mid = Math.ceil( funcs.length / 2 )
			var inner = $jin.pipe( funcs.slice( 0, mid ) )
			var outer = $jin.pipe( funcs.slice( mid ) )
			return function( value ){
				return outer( inner( value ) )
			}
	}
}})

/**
 * @name $jin.pipe.nop
 * @method nop
 * @member $jin.pipe
 * @static
 */
$jin.method({ '$jin.pipe.nop': function( value ){
	return value
}})