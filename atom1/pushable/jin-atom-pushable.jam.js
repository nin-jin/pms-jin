/**
 * @name $jin.atom1.pushable#notify
 * @method notify
 * @member $jin.atom1.pushable
 */
$jin.method({ '$jin.atom1.pushable..notify': function( next, prev ){
	$jin.atom1.bound( function( ){
		if( this._status === this.constructor.statusNull ) return
		if( this._status === this.constructor.statusError ) return
		
		this._push.call( this._owner, next, prev )
	}.bind(this) )

	return this[ '$jin.atom1.variable..notify' ]( next, prev )
}})

