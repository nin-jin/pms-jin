/**
 * @name $jin.atom1.clearable#freeze
 * @method freeze
 * @member $jin.atom1.clearable
 */
$jin.method({ '$jin.atom1.clearable..freeze': function( ){
	this._clear.call( this._owner )
	
	return this['$jin.atom1.pullable..freeze']()
}})
