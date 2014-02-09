$jin.klass.old( '$jin.file', '$jin.sourceFile')

$jin.property( '$jin.sourceFile..sourceList', function( ){
    if( this.isFile() ) return [ this ]
    
    return this.childList()
    .filter( function( file ){
        return file.isFile() && /^[a-zA-Z]/.test( file.name() )
    } )
} )

$jin.property( '$jin.sourceFile..moduleList', function( ){
    return ( this.isDir() ? this.childList() : [ ] )
    .filter( function( file ){
        return file.isDir() && /^[a-zA-Z]/.test( file.name() )
    } )
} )

$jin.method( '$jin.sourceFile..deepModuleList', function( ){
    var moduleList = [ this ]
    
    this.moduleList().forEach( function( mod ){
        moduleList = moduleList.concat( mod.deepModuleList() )
    })
    
    return moduleList
} )

$jin.method( '$jin.sourceFile..require', function( ){
    if( this.exists() ) return this
    
    console.log( 'Module (' + this.path() + ') not found. Search (' + this.name() + ') in repository...' )
    
    $jin.async2sync( $node.npm.load ).call( $node.npm, {} )
    var meta = $jin.async2sync( $node.npm.commands.view ).call( $node.npm.commands, [ this.name(), 'repository' ] )
    for( var version in meta ){
        var repository = meta[ version ].repository
        break
    }
    
    var repo = repository && repository.url
    if( !repo ) throw new Error( 'Repository for (' + this.name() + ') not found' )
    if( repository.type !== 'git' ){
        throw new Error( 'Please, install this package manualy from (' + repo + ')' )
    }
    
    console.log( 'Installing (' + this.path() + ') from (' + repo + ')...' )
    
    $jin.execute( 'git', [ 'clone', repo, this.path() ] )
    
    return this
} )

$jin.method( '$jin.sourceFile..buildFile', function( prefix, vary, postfix ){
    var name = $jin.vary2string( prefix, vary, postfix )
    return this.child( '-mix' ).child( name )
} )

$jin.property( '$jin.sourceFile..dependList', function( ){
    var depends = [ ]
    
    try {
         
        if( /\.jam\.js$/.test( this.name() ) ){
            
            String( this.content() )
            .replace
            (   /\$([a-z][a-z0-9]+(?:[._][a-z0-9]+)*)/ig
            ,   function( str, path ){
                    add( path.replace( /[._-]/g, '/' ) )
                }
            )
            
        } else if( /\.meta\.tree$/.test( this.name() ) ){
            
            var meta= $jin.tree.parse( this.content() )
            
            meta.select(' include / ').values().forEach( add )
            
        } else if( /\.xsl$/.test( this.name() ) ){
            
            String( this.content() )
            .replace
            (   /<([a-z][a-z0-9]+(?:[._-][a-z0-9]+)+)/ig
            ,   function( str, path ){
                    add( path.replace( /[._-]/g, '/' ) )
                }
            )
            .replace
            (   /[ \t\n]([a-z][a-z0-9]+(?:[._-][a-z0-9]+)+)="/ig
            ,   function( str, path ){
                    add( path.replace( /[._-]/g, '/' ) )
                }
            )
        }
        
    } catch( error ){
        error.message = 'Can not find dependencies in [' + this.path() + ']\n' + error.message
        throw error
    }
    
    function add( path ){
		path = path.replace( /(^\s+|\s+$)/g, '' )
        if( !~depends.indexOf( path ) ) depends.push( path )
    }
    
    return depends
} )

$jin.method( '$jin.sourceFile..dependTree', function( vary, moduleList ){
    var root = this
    
    if( !vary ) vary= {}
    var varyFilter= []
    for( var key in vary ){
        var val= vary[ key ]
        varyFilter.push( '\\.' + key + '=(?!' + val + '\\.)' )
    }
    varyFilter= RegExp( varyFilter.join( '|' ) || '^$' )
    
    var indexSrcs = []
    var touchedMods = []
    var root = this
    
    if( !moduleList ) moduleList = this.deepModuleList()
    
    var tree = moduleList.map( function proceedDep( mod ){
        var subTree = []
        
        var pack = root.child( mod.relate( root ).replace( /\/.*/, '' ) )
        pack.require()
        
        while( !mod.exists() ) mod = mod.parent()
        
        if( mod === root ) return
        
        if( ~touchedMods.indexOf( mod ) ) return
        touchedMods.push( mod )
        
        var depMods = []
        
        var parent = mod.parent()
        if( parent !== root ) depMods.push( parent )
        
        var srcs = mod.sourceList()
        
        srcs = srcs.filter( function( src ){
            return !varyFilter.test( src.name() )
        } )
        
        if( !srcs.length ) return
        
        srcs.sort( function( a, b ){
            var aNames = a.name().split( '.' )
            var bNames = b.name().split( '.' )
            var aName= aNames[0]
            var bName= bNames[0]
            if( aName.length < bName.length ) return -1
            if( aName.length > bName.length ) return 1
            if( aName < bName ) return -1
            if( aName > bName ) return 1
            if( aNames.length < bNames.length ) return -1
            if( aNames.length > bNames.length ) return 1
            if( a.name() < b.name() ) return -1
            if( a.name() > b.name() ) return 1
            return 0
        })
        
        srcs.forEach( function( src ){
            var srcDeps = src.dependList().map( function( path ){
                if( path[0] === '.' ) var dep = src.parent().resolve( path )
                else var dep = root.resolve( path )
                return dep
            } )
            depMods = depMods.concat( srcDeps )
        } )
        
        var depList =  depMods.map( proceedDep ).filter( function( dep ){ return dep } )
        
        srcs = srcs.filter( function( src ){
            return !~indexSrcs.indexOf( src )
        } )
        indexSrcs = indexSrcs.concat( srcs )
        
        depHash = {}
        depList.forEach( function( dep ){
            for( var key in dep ) depHash[ key ] = dep[ key ]
        } )
        depHash[ '' ] = srcs.map( function( file ){ return file.relate() } )
        var node = {}
        node[ mod.relate() ] = depHash
        return node
    } )
    
    return tree
} )

$jin.method( '$jin.sourceFile..index', function( vary, moduleList ){
    var tree = this.dependTree( vary, moduleList )
    var index = []
    
    tree.map( function collect( node ){
        for( var key in node ){
            if( key ) collect( node[ key ] )
            else index = index.concat( node[ key ] )
        }
    })
    
    return index.map( $jin.sourceFile )
} )
