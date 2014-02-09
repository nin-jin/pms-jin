$jin.test( function deffering( test ){
    test.timeout( 100 )
    $jin.defer(function(){
		test.equal( x, 1 )
        test.done( true )
    })
    var x = 1
} )
