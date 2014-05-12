/**
 * Возращает атом, который дожидается вычисления текущего, после чего отписывается и вызывает один из колбэков.
 *
 * @name $jin.atom#then
 * @method then
 * @param {function( result )} [done]
 * @param {function( error }} [fail]
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
 * Короткая запись для
 *     .then( null, function( error ){ ... } )
 *
 * @name $jin.atom#catch
 * @method catch
 * @param {function( error }} [fail]
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..catch': function( fail ){
	return this.then( null, fail )
}})
