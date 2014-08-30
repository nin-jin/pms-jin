/**
 * @name $jin.atom.clearable#freeze
 * @method freeze
 * @member $jin.atom.clearable
 */
$jin.method({ '$jin.atom.clearable..freeze': function( ){
	this._clear.call( this._owner )
	
	return this['$jin.atom.pullable..freeze']()
}})
