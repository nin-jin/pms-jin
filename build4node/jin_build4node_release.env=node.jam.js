$jin.method( '$jin.build4node.release', function( mod, vary ){
    mod = $jin.sourceFile( mod )
    
    vary = vary || {}
    vary.env = 'node'
    vary.stage = 'release'
    
    var buildFile = mod.buildFile( 'index', vary, 'js' )
    
    var index = $jin.sourceFile('.').index( vary, mod.deepModuleList() )
    .filter( function( src ){
        return /\.js$/.test( src.name() )
    } )
    .map( function( src ){
        return ';// ' + src.relate( buildFile.parent() ) + '\n' + src.content()
    } )

    return buildFile.content( 'with( this ){\n' + index.join( '\n' ) + '\n}' )
} )
