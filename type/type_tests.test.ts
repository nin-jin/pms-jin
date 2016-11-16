module $ {
	$mol_test({
		
		'scalars'() {
			$mol_assert_equal( $jin_type( void 0 ) , 'Undefined' )
			$mol_assert_equal( $jin_type( null ) , 'Null' )
			$mol_assert_equal( $jin_type( 0 ) , 'Number' )
			$mol_assert_equal( $jin_type( '' ) , 'String' )
			$mol_assert_equal( $jin_type( false ) , 'Boolean' )
		} ,
		
		'common objects'() {
			$mol_assert_equal( $jin_type( {} ) , 'Object' )
			$mol_assert_equal( $jin_type( [] ) , 'Array' )
			$mol_assert_equal( $jin_type( arguments ) , 'Arguments' )
		} ,
		
		'special objects'() {
			//$mol_assert_equal( $jin_type( function() { return this }() ) , 'Global' )
			$mol_assert_equal( $jin_type( new Date ) , 'Date' )
			$mol_assert_equal( $jin_type( new RegExp( '' ) ) , 'RegExp' )
		} ,
		
	})
	
}
