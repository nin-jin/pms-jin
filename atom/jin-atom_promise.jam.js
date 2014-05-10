/**
 * @name $jin.atom#then
 * @method then
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..then': function( done, fail ){
	
	if( this._error ){
		if( fail ) fail( this._error )
		return this
	}
	
	if( this._value ){
		done( this._value )
		return this
	}
	
	var self = this
	var promise = $jin.atom({
		pull: function( ){
			return self.get()
		},
		push: function( next ){
			if( next === void  0 ) return
			promise.disobeyAll()
		},
		merge: function( next ){
			if( next === void  0 ) return
			return done ? done( next ) : next
		},
		fail: fail
	})
	promise.pull()
	
	return promise
}})

/**
 * @name $jin.atom#catch
 * @method catch
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..catch': function( fail ){
	return this.then( null, fail )
}})
