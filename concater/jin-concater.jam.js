/**
 * @name $jin.concater
 * @method concater
 * @member $jin
 * @static
 */
$jin.method({ '$jin.concater': function( funcs ){
	switch( funcs.length ){
		case 0: return String
		case 1: return funcs[0]
		default:
			var mid = Math.ceil( funcs.length / 2 )
			var first = $jin.concater( funcs.slice( 0, mid ) )
			var second = $jin.concater( funcs.slice( mid ) )
			var types = ( typeof first === 'function' ) + ':' + ( typeof second === 'function' )
			switch( types ){
				case 'true:true': return function( value ){
					return first( value ) + second( value )
				}
				case 'false:true': return function( value ){
					return first + second( value )
				}
				case 'true:false': return function( value ){
					return first( value ) + second
				}
				case 'false:false': return function( value ){
					return first + second
				}
			}
	}
}})
