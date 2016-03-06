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
		throw new Error( `Not true (${value})` )
	}
	
	not( value ) {
		if( !value ) return
		throw new Error( `Not false (${value})` )
	}
	
	fail( message ) {
		throw new Error( message )
	}
	
	equal( a , b ) {
		if( a === b ) return 
		throw new Error( `Not equal (${a},${b})` )
	}
	
	unique( a , b ) {
		if( a !== b ) return
		throw new Error( `Not unique (${a},${b})` )
	}
	
}
