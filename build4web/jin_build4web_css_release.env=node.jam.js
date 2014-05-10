/**
 * @name $jin.build4web.css.release
 * @method release
 * @static
 * @member $jin.build4web.css
 */
$jin.method({ '$jin.build4web.css.release': function( mod, vary ){
    mod = $jin.file( mod )
    
    vary= vary || {}
    vary.stage= 'release'
    
    var indexFile = mod.buildFile( 'index', vary, 'css' )
    
    var index= $jin.file('.').index( vary, mod.deepModuleList() )
    .filter( function( src ){
        return /\.css$/.test( src.name() )
    } )
    .map( function( src ){
        var content = String( src.content() )
        
        content = content.replace( /url\((.*?)\)/g, function( str, path ){
            path = path.replace( /^[\s'"]+|[\s'"]+$/g, '' )
            return 'url("' + src.parent().resolve( path ).relate( indexFile.parent() ) + '")'
        })
        
        return '/* ../../' + src.uri() + ' */\n' + content
    } )
    .join( '\n' )
    
    return indexFile.content( index )
}})
