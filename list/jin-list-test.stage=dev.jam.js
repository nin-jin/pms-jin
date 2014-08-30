$jin.test( function bisect_general( test ){
	var list = $jin.list( 0,1,2,3,4,5,6,7,8,9 )
	var index = list.bisect( function( item ){
		return item > 3
	} )
	test.equal( index, 4 )
} )

$jin.test( function bisect_empty( test ){
	var list = $jin.list()
	var index = list.bisect( function( item ){
		return item > 3
	} )
	test.equal( index, -1 )
} )

$jin.test( function bisect_all_matches( test ){
	var list = $jin.list( 0,1,2,3,4,5,6,7,8,9 )
	var index = list.bisect( function( item ){
		return item >= 0
	} )
	test.equal( index, 0 )
} )

$jin.test( function bisect_no_matches( test ){
	var list = $jin.list( 0,1,2,3,4,5,6,7,8,9 )
	var index = list.bisect( function( item ){
		return item > 10
	} )
	test.equal( index, 10 )
} )
