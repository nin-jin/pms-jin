$jin.method({ '$jin.build4web.js.release': function( mod, vary ){
    mod = $jin.sourceFile( mod )
    
    vary = vary || {}
    vary.env = 'web'
    vary.stage = 'release'
    
    var index = $jin.sourceFile('.').index( vary, mod.deepModuleList() )
    .filter( function( src ){
        return /\.js$/.test( src.name() )
    } )
    .map( function( src ){
        return ';//../../' + src.uri() + '\n' + src.content()
    } )
    
    return mod.buildFile( 'index', vary, 'js' ).content( index.join( '\n' ) )
}})
