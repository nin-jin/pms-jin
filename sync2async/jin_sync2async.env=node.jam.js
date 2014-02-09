this.$jin.sync2async=
$jin.proxy( { apply: function( func, self, args ){
    if( args.length > func.length ){
        var callback= [].pop.call( args )
    }
    
    if( !callback ) callback = function( error ){
        if( !error ) return
        console.error( String( error ) + '\n' + String( error.stack ).split( String( error ) ).join( '' ) )
        process.exit( 1 )
    }
    
    var proc= function( ){
        try {
            var result= func.apply( self, args )
        } catch( err ){
            var error= err
        }
        callback( error, result )
    }
    
    var fibers= $node.fibers
    
    if( fibers.current ) proc()
    else fibers( proc ).run()
} } )
