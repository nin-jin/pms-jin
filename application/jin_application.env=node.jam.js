$jin.method( '$jin.application', function( app, done ){
    return $jin.sync2async( app ).call( $jin.root(), done )
})
