/**
 * @name $jin.atom1.failable#fail
 * @method fail
 * @member $jin.atom1.failable
 */
$jin.method({ '$jin.atom1.failable..fail': function( error ){
	this[ '$jin.atom1.variable..fail' ]( error )
	
	return $jin.atom1.bound( function( ){
		return this._fail.call( this._owner, error )
	}.bind(this) )
}})

