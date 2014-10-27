module $jin.func {
    
    export function collector( ) {
        return function( next ){
            var res = []
            var val
            while( true ){
                val = next()
                if( val === void 0 ) break
                res.push( val )
            }
            return res
        }
    }
    
}
