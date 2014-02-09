$jin.method( '$jin.thread', function( proc ){
    return function $jin_thread_wrapper( ){
        try {
            proc.apply( this, arguments )
        } catch( error ){
            console.error( error.stack )
        }
    }
} )
