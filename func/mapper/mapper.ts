module $jin.func {
    
    export function mapper ( transform ) {
        return function( next ) {
            return function( ){
                var val = next()
                if( val !== void 0 ) val = transform( val )
                return val
            }
        }
    }
    
}

