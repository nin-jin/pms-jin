module $jin.test {
    
    $jin.test( test =>{
        var one = new $jin.object
        var two = new $jin.object
        test.equal( Number( one.objectName ) + 1, Number( two.objectName ) )
    } )
    
}