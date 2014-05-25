$jin.test( function scalars( test ){
	test.equal( $jin.type( void 0 ), 'Undefined' )
	test.equal( $jin.type( null ), 'Null' )
	test.equal( $jin.type( 0 ), 'Number' )
	test.equal( $jin.type( '' ), 'String' )
	test.equal( $jin.type( false ), 'Boolean' )
})

$jin.test( function common_objects( test ){
	test.equal( $jin.type( {} ), 'Object' )
	test.equal( $jin.type( [] ), 'Array' )
	test.equal( $jin.type( arguments ), 'Arguments' )
})

$jin.test( function special_objects( test ){
	test.equal( $jin.type( function(){ return this }() ), 'Global' )
	test.equal( $jin.type( new Date ), 'Date' )
	test.equal( $jin.type( new RegExp ), 'RegExp' )
})
