module $jin.func {
    
    export function limiter ( count : number ){
        return function( next ) {
            var index = 0
            return function( ){
                if( index++ < count ) return next()
            }
        }
    }
    
}

