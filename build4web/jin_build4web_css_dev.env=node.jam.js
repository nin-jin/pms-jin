$jin.method( '$jin.build4web.css.dev', function( mod, vary ){
    mod = $jin.sourceFile( mod )
    
    vary = vary || {}
    vary.stage = 'dev'
    
    var indexFile = mod.buildFile( 'index', vary, 'css' )
    
    var all= $jin.sourceFile('.').index( vary, mod.deepModuleList() )
    .filter( function( src ){
        return /\.css$/.test( src.name() )
    } )
    
    if( all.length > 30  ){
        var index = []
        var p = 0
        var page = []
        
        function makePage( ){
            var pageFile= mod.buildFile( 'page=' + p, vary, 'css' )
            pageFile.content( page.join( '\n' ) )
            index.push( '@import url( "' + pageFile.uri( indexFile.parent() ) + '" );' )
            ++p
            page = []
        }
        
        all.forEach( function( src ){
            page.push( '@import url( "' + src.uri( indexFile.parent() ) + '" );' )
            if( page.length > 30 ) makePage()
        })
        if( page.length ) makePage()
        
    } else {
        var index= all.map( function( src ){
            return '@import url("' + src.uri( indexFile.parent() ) + '");'
        } )
    }
    
    return indexFile.content( index.join( '\n' ) )
} )
