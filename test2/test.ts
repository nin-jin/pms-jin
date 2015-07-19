class $jin_test2 {
	
	static all = []
	
	static run() {
		for( var test of this.all ) {
			test.run()
		}
	}
	
	code : { ( test : $jin_test2 ) : void }
	status = 'wait'
	
	constructor( code : string | { ( test : $jin_test2 ) : void } ) {
		if( typeof code === 'string' ) {
			this.code = <any> new Function( 'test' , code )
		} else {
			this.code = code
		}
		$jin_test2.all.push( this )
	}
	
	run() {
		this.code.call( null , this )
	}
	
	done() {
		
	}
	
	ok( value ) {
		if( value ) return
		throw $jin2_error({
			reason : 'Not true' ,
			value : String( value )
		})
	}
	
	not( value ) {
		if( !value ) return
		throw $jin2_error({
			reason : 'Not false' ,
			value : String( value )
		})
	}
	
	fail( message ) {
		throw new Error( message )
	}
	
	equal( a , b ) {
		if( a === b ) return 
		throw $jin2_error({
			reason : 'Not equal' ,
			values : [ a , b ].map( String )
		})
	}
	
	unique( a , b ) {
		if( a !== b ) return
		throw $jin2_error({
			reason : 'Not unique' ,
			values : [ a , b ].map( String )
		})
	}
	
}
