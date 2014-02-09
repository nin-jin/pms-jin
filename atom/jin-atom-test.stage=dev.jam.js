$jin.test( function pulling( test ){
    var x
    var y = $jin.atom({ pull: function(){ return x = Math.random() } })
    test.equal( y.get(), x )
} )

$jin.test( function pulling_oldValue( test ){
    var y = $jin.atom({ pull: function( old ){ return old || Math.random() } })
	var x1 = y.get()
	y.pull()
	x2 = y.get()
    test.equal( x1, x2 )
} )

$jin.test( function stringifing( test ){
    var x = 1
    var y = $jin.atom({pull: function(){ return x } })
    test.equal( y + '2', '12' )
} )

$jin.test( function numberifing( test ){
    var x = 1
    var y = $jin.atom({pull: function(){ return x } })
    test.equal( y + 1, 2 )
} )

$jin.test( function memorizing( test ){
    var y = $jin.atom({ pull: function(){ return Math.random() } })
    test.equal( y.get(), y.get() )
} )

$jin.test( function updating( test ){
    var y = $jin.atom({ pull: function(){ return Math.random() } })
    test.unique( y.get(), y.pull() )
} )

$jin.test( function pushing( test ){
	var x
    var y = $jin.atom(
	{	pull: function(){ return 1 }
	,	push: function( next, prev ){ x = [ next, prev ] }
	} )
	y.get()
    test.equal( String( x ), '1,' )
} )

$jin.test( function tracking( test ){
    test.timeout( 100 )
    var x = $jin.atom({ pull: function(){ return 1 } })
    var y = $jin.atom({ pull: function(){ return x + 1 } })
    y1 = y.get()
    x.value( 2 )
    $jin.defer(function(){
        y2 = y.get()
        test.unique( y1, y2 )
        test.done( true )
    })
} )

$jin.test( function resetting( test ){
    var x = 1
    var y = $jin.atom({ pull: function(){ return x + 1 } })
    y1 = y.get()
    x = 2
    y.value( void 0 )
    y2 = y.get()
    test.unique( y1, y2 )
} )

//$jin.test( function reaping( test ){
//	test.timeout( 100 )
//    var x = 1
//    var y = $jin.atom({ pull: function( ){
//		return x + 1
//	} })
//    var z = $jin.atom({ pull: function( ){
//		return y + 1
//	} })
//    z.get()
//    x = 2
//    z.disobeyAll()
//	$jin.schedule( 10, function(){
//		test.equal( y.get(), 3 )
//		test.done( true )
//	} )
//} )

