$jin.test( function( test ){
	var v = $jin.vector([ 1, 2, 3, 4 ])
	test.equal( v.x(), 1 )
	test.equal( v.y(), 2 )
	test.equal( v.z(), 3 )
} )
