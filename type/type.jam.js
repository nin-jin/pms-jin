/**
 * @name $jin.type
 * @method type
 * @member $jin
 * @static
 */
$jin.method({ '$jin.type': function( value ){
	var str = {}.toString.apply( value )
	var type = str.substring( 8, str.length - 1 )
	if( [ 'Window', 'global' ].indexOf( type ) >= 0  ) type = 'Global'
	return type
}})