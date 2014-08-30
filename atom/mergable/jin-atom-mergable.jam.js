/**
 * Записать новое значение (предварительно слив с текущим).
 *
 * @name $jin.atom.mergable#put
 * @method put
 * @param {any} next
 * @member $jin.atom.mergable
 */
$jin.method({ '$jin.atom.mergable..put': function( next ){
	
	var prev = ( this._status === this.constructor.statusError ) ? null : this._value
	var next2 = this._merge.call( this._owner, next, prev )
	
	return this['$jin.atom.variable..put']( next2 )
}})
