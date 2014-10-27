/**
 * @name $jin.atom1.getable#get
 * @method get
 * @member $jin.atom1.getable
 */
$jin.method({ '$jin.atom1.getable..get': function( ){
	var value = this['$jin.atom1.pullable..get']()
	return this._get.call( this._owner, value )
}})
