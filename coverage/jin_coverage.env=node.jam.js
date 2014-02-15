$jin.method({ '$jin.coverage': function( pack ){
    pack= $jin.pack( pack )
    from= pack.mod( '-mix' )
    to= pack.mod( '-cov' )
    
    $jin.execute( 'jscoverage', [ '' + from, '' + to ] )
    
    return to
}})
