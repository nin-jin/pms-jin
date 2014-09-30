$jin.test( function deffering( test ){
    test.timeout( 0 )
    new $jin.defer(function(){
        test.equal( x, 1 )
        test.done( true )
    })
    var x = 1
} )
