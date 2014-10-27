module $jin.func {
    
    export function filter ( check ){
        return function( next ) {
            return function( ) {
                while( true ) {
                    var val = next()
                    if( val === void 0 ) return
                    if( check( val ) ) return val
                }
            }
        }
    }
    
}
