/**
 * @name $jin.list
 * @class $jin.list
 * @returns $jin.list
 * @method list
 * @member $jin
 * @static
 */
$jin.method({ '$jin.list': function( ){
	var list = Array.apply( null, arguments )
	list.__proto__ = arguments.callee.prototype
	return list
}})

$jin.glob( '$jin.list.', [] )

//$jin.mixin({ '$jin.list': [ 'Array' ] })
