this.$jin.sync2async= function( func ){
	return function( ) {
		var self = this
		var args = arguments
		
		if( args.length > func.length ){
			var callback= [].pop.call( args )
		}

		if( !callback ) callback = function( error ){
			if( !error ) return
			$jin.log.error( error )
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

		//if( fibers.current ) proc()
		//else
		fibers( proc ).run()
	}
}

//$jin.proxy( { apply: function( func, self, args ){
//    if( args.length > func.length ){
//        var callback= [].pop.call( args )
//    }
//    
//    if( !callback ) callback = function( error ){
//        if( !error ) return
//        $jin.log.error( error )
//        process.exit( 1 )
//    }
//    
//    var proc= function( ){
//        try {
//            var result= func.apply( self, args )
//        } catch( err ){
//            var error= err
//        }
//        callback( error, result )
//    }
//    
//    var fibers= $node.fibers
//    
//    if( fibers.current ) proc()
//    else fibers( proc ).run()
//} } )
