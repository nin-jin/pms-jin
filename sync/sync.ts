module $jin.sync {
    export var promise = $jin.async2sync( ( promise , done ) => {
        promise.then( result => done( null ,result ) , done )
    } )
}
