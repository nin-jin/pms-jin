/**
 * @name $jin.set
 * @class $jin.list
 * @returns $jin.list
 * @method set
 * @member $jin
 * @static
 */
$jin.method({ '$jin.set': function( ){
	var list = Array.apply( null, arguments )
	list.__proto__ = arguments.callee.prototype
	return list
}})

$jin.glob( '$jin.set.', [] )

$jin.mixin({ '$jin.set': [ '$jin.list' ] })
