module $jin.func {

    export function iterator( ){
        return function( list ){
            var index = 0
            return function( ){
                return list[ index++ ]
            }
        }
    }
    
}
