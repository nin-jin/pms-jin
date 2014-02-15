$jin.method({ '$jin.build4web.js.dev': function( mod, vary, mods ){
    mod = $jin.sourceFile( mod )
    
    vary = vary || {}
    vary.env= 'web'
    vary.stage= 'dev'
    
    var buildFile = mod.buildFile( 'index', vary, 'js' )
    
    var index = $jin.sourceFile('.').index( vary, mods || mod.deepModuleList() )
    .filter( function( src ){
        return /\.js$/.test( src.name() )
    } )
    .map( function( src ){
        return '"' + src.relate( buildFile.parent() ) + '",'
    } )
    
    index.unshift( "\
void function( modules ){                                               \n\
    var scripts= document.getElementsByTagName( 'script' )              \n\
    var script= document.currentScript || scripts[ scripts.length - 1 ] \n\
    var dir= script.src.replace( /[^/]+$/, '' )                         \n\
    try {                                                               \n\
        document.write( '' )                                            \n\
        var writable= true                                              \n\
    } catch( error ){                                                   \n\
        var writable= false                                             \n\
    }                                                                   \n\
    var next= function( ){                                              \n\
        var module= modules.shift()                                     \n\
        if( !module ) return                                            \n\
        if( writable ) {                                                \n\
            document.write( '<script src=\"'+dir+module+'\"></script>' )\n\
            next()                                                      \n\
        } else {                                                        \n\
            var loader= document.createElement( 'script' )              \n\
            loader.parentScript= script                                 \n\
            loader.src= dir + module                                    \n\
            loader.onload= next                                         \n\
            script.parentNode.insertBefore( loader, script )            \n\
        }                                                               \n\
    }                                                                   \n\
    next()                                                              \n\
}.call( this, [                                                         \n\
    " )
    
    index.push( " null ])" )
    
    return buildFile.content( index.join( '\n' ) )
}})
