/**
 * @name $jin.atom.failable#fail
 * @method fail
 * @member $jin.atom.failable
 */
$jin.method({ '$jin.atom.failable..fail': function( error ){
	this[ '$jin.atom.variable..fail' ]( error )
	
	return $jin.atom.bound( function( ){
		return this._fail.call( this._owner, error )
	}.bind(this) )
}})

