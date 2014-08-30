/**
 * @name $jin.atom.getable#get
 * @method get
 * @member $jin.atom.getable
 */
$jin.method({ '$jin.atom.getable..get': function( ){
	var value = this['$jin.atom.pullable..get']()
	return this._get.call( this._owner, value )
}})
