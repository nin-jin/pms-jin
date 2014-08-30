/**
 * @name $jin.list
 * @class $jin.list
 * @returns $jin.list
 */
$jin.glob( '$jin.list', function( ){
	var iframe = document.createElement( 'iframe' )
	iframe.id = 'jin-list'
	document.body.appendChild( iframe )
	var Array = iframe.contentWindow.Array
	//document.body.removeChild( iframe )
	return Array
}() )

$jin.mixin({ '$jin.list': [ 'Array' ] })
