/**
 * @name $jin.build4web.js.release
 * @method release
 * @static
 * @member $jin.build4web.js
 */
$jin.method({ '$jin.build4web.js.release': function( mod, vary ){
    mod = $jin.file( mod )
    
    vary = vary || {}
    vary.env = 'web'
    vary.stage = 'release'
    
    var index = $jin.file('.').index( vary, mod.deepModuleList() )
    .filter( function( src ){
        return /\.js$/.test( src.name() )
    } )
    .map( function( src ){
        return ';//../../' + src.uri() + '\n' + src.content()
    } )
    
    return mod.buildFile( 'index', vary, 'js' ).content( index.join( '\n' ) )
}})
