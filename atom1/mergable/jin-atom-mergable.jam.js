/**
 * Записать новое значение (предварительно слив с текущим).
 *
 * @name $jin.atom1.mergable#put
 * @method put
 * @param {any} next
 * @member $jin.atom1.mergable
 */
$jin.method({ '$jin.atom1.mergable..put': function( next ){
	
	var prev = ( this._status === this.constructor.statusError ) ? null : this._value
	var next2 = this._merge.call( this._owner, next, prev )
	
	return this['$jin.atom1.variable..put']( next2 )
}})
