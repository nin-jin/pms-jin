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
	var listener = {
		id: $jin.value( $jin.makeId( $jin.func.name( done ) ) ),
		update: function( ){
			self.dislead( listener )
			
			var error = self.error()
			if( error !== void 0 ) return fail && fail( error )
			
			var value = self.value()
			if( value !== void 0 ) return done( value )
		}
	}
	this.lead( listener )
	
	return this
}})

$jin.method({ '$jin.atom..catch': function( fail ){
	if( this._error ){
		fail( this._error )
		return this
	}
	
	var self = this
	var listener = {
		id: $jin.value( $jin.makeId( $jin.func.name( fail ) ) ),
		update: function( ){
			self.dislead( listener )
			
			var error = self.error()
			if( error !== void 0 ) return fail( error )
		}
	}
	this.lead( listener )
	
	return this
}})
