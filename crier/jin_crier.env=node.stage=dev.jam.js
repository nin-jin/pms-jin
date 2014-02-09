$jin.test( function( test ){
    test.timeout(1)
    var crier = $jin.crier()
    crier.listen( 'xxx', handler )
    var event = $jin.event({ type: 'xxx' })
    crier.scream( event )
    function handler( e ){
        test.equal( e, event )
        test.done( true )
    }
} )

$jin.test( function( test ){
    var crier = $jin.crier()
    crier.listen( 'xxx', handler )
    crier.forget( 'xxx', handler )
    var event = $jin.event({ type: 'xxx' })
    crier.scream( event )
    function handler( e ){
        test.fail()
    }
} )

$jin.test( function( test ){
    var crier = $jin.crier()
    crier.listen( 'xxx', handler ).destroy()
    var event = $jin.event({ type: 'xxx' })
    crier.scream( event )
    function handler( e ){
        test.fail()
    }
} )

$jin.test( function( test ){
    var crier = $jin.crier()
    crier.listen( 'xxx', handler1 )
    crier.listen( 'xxx', handler2 )
    var event = $jin.event({ type: 'xxx' })
    var result = ''
    crier.scream( event )
    function handler1( e ){
        result += 'foo'
    }
    function handler2( e ){
        result += 'bar'
    }
    test.equal( result, 'foobar' )
} )
