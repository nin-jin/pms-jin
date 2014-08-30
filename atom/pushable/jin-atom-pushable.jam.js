/**
 * @name $jin.atom.pushable#notify
 * @method notify
 * @member $jin.atom.pushable
 */
$jin.method({ '$jin.atom.pushable..notify': function( next, prev ){
	$jin.atom.bound( function( ){
		if( this._status === this.constructor.statusNull ) return
		if( this._status === this.constructor.statusError ) return
		
		this._push.call( this._owner, next, prev )
	}.bind(this) )

	return this[ '$jin.atom.variable..notify' ]( next, prev )
}})

