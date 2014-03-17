$jin.method({ '$jin.build4node.dev': function( mod, vary ){
    mod = $jin.file( mod )
    
    vary = vary || {}
    vary.env = 'node'
    vary.stage = 'dev'
    
    var buildFile = mod.buildFile( 'index', vary, 'js' )
    
    var index = $jin.file('.').index( vary, mod.deepModuleList() )
    .filter( function( src ){
        return /\.js$/.test( src.name() )
    } )
    .map( function( src ){
        return '("' + src.relate( buildFile.parent() ) + '")'
    } )
    
    index.unshift( "\
void function( path ){                                   \n\
    path = require( 'path' ).resolve( __dirname, path )  \n\
    var fs = require( 'fs' )                             \n\
    var source= fs.readFileSync( path )                  \n\
    source= 'with(this){' + source + '}'                 \n\
    module._compile( source, path )                      \n\
    return arguments.callee                              \n\
}                                                        \n\
    " )
    
    return buildFile.content( index.join( '\n' ) )
}})
