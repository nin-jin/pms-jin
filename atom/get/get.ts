module $jin.atom {

    export function get( map ) {

        var res : any = []

        var wait = null
        for( var key in map ) {
            try {
                res[ key ] = map[ key ].get()
            } catch( error ) {
                if( error instanceof $jin.atom.wait ) {
                    wait = wait || error
                } else {
                    throw error
                }
            }
        }

        if( wait ) throw wait

        return res
    }

}