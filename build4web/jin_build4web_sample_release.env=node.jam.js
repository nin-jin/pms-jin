$jin.method({ '$jin.build4web.sample.release': function( mod, vary ){
    mod = $jin.sourceFile( mod )
    
    vary = vary || {}
    vary.env = 'web'
    vary.stage = 'release'
    
    var sources = $jin.sourceFile('.').index( vary, mod.deepModuleList() )
    .filter( function( src ){
        return /\.sample\.html$/.test( src.name() )
    } )
    .map( function( src ){
        return src.content().toString()
    } )
    
    sources = "$jin.sample.strings( '" + sources.join( '\n' ).replace( /\'/g, "\\'" ).replace( /[\r\n]+/g, '\\n' ) + "' )"
    
    return mod.buildFile( mod.name(), vary, 'sample.html.js' ).content( sources )
}})
