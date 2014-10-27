module $jin.func {
    
    export function pipeline ( procs ){
        return function( input ) {
            for( var i = 0 ; i < procs.length ; ++i ) {
                input = procs[ i ]( input )
            }
            return input
        }
    }
    
}

