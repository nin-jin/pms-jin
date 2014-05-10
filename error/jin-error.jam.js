/**
 * @name $jin.error
 * @method error
 * @static
 * @member $jin
 */
$jin.definer({ '$jin.error': function( path, traits ){
	var error = $jin.trait( path )
	error.prototype = new Error
	error.prototype.constructor = error
	$jin.mixin( path, [ '$jin.error' ] )	
}})

$jin.mixin({ '$jin.error': [ '$jin.wrapper' ] })

/**
 * @name $jin.error.exec
 * @method exec
 * @static
 * @member $jin.error
 */
$jin.method({ '$jin.error.exec': function( message ){
	return this['$jin.wrapper.exec']( new Error( message ) )
}})

/**
 * @name $jin.error#init
 * @method init
 * @member $jin.error
 */
$jin.method({ '$jin.error..init': function( error ){
	this['$jin.wrapper..init']( error )
	this.name = this.constructor.id()
	this.message = error.message
	this.stack = error.stack
	return this
}})
