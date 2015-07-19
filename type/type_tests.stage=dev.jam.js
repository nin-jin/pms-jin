$jin.test( function scalars( test ){
	test.equal( $jin_type( void 0 ), 'Undefined' )
	test.equal( $jin_type( null ), 'Null' )
	test.equal( $jin_type( 0 ), 'Number' )
	test.equal( $jin_type( '' ), 'String' )
	test.equal( $jin_type( false ), 'Boolean' )
})

$jin.test( function common_objects( test ){
	test.equal( $jin_type( {} ), 'Object' )
	test.equal( $jin_type( [] ), 'Array' )
	test.equal( $jin_type( arguments ), 'Arguments' )
})

$jin.test( function special_objects( test ){
	test.equal( $jin_type( function(){ return this }() ), 'Global' )
	test.equal( $jin_type( new Date ), 'Date' )
	test.equal( $jin_type( new RegExp ), 'RegExp' )
})
