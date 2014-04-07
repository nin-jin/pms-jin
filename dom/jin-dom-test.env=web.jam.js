$jin.test( function hasRange_including( test ){
	var root = $jin.dom( '<div> </div>' ).parent( document.body )
	var text = root.childList()[0]
	
	test.ok( root.rangeContent().hasRange( text.rangeContent() ) )
	
	root.parent( null )
} )

$jin.test( function hasRange_excluding( test ){
	var one = $jin.dom( '<div></div>' ).parent( document.body )
	var two = $jin.dom( '<div></div>' ).parent( document.body )
	
	test.not( one.rangeAround().hasRange( two.rangeAround() ) )
	
	one.parent( null )
	two.parent( null )
} )

$jin.test( function hasRange_equal( test ){
	var root = $jin.dom( '<div></div>' ).parent( document.body )
	
	test.ok( root.rangeAround().hasRange( root.rangeAround() ) )
	test.ok( root.rangeContent().hasRange( root.rangeContent() ) )
	
	root.parent( null )
} )
