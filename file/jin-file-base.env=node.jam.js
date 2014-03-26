$jin.klass({ '$jin.file.base': [ '$jin.registry' ] })

$jin.property( '$jin.file.base..nativeAPI', function( ){
    return /*$jin.fiberize*/( $node['fs'] )
} )

$jin.alias( '$jin.registry..id', '$jin.file.base..id', 'path' )

$jin.property( '$jin.file.base..path', function( path ){
	if( path ) path = String( path )
	else path = ''
	
	path = $node.path.resolve( path ).replace( /\\/g, '/' )
	
	//this['$jin.registry..id']( path )
    return path
} )
    
$jin.atom.prop({ '$jin.file.base..stat': {
	pull: function( prev ){
		try {
			var stat = this.nativeAPI().statSync( this.path() )
			this.watcher()
		} catch( error ){
			if( error.code !== 'ENOENT' ) throw error
			stat = null
		}
		return stat
	}
}})

$jin.atom.prop({ '$jin.file.base..version': {
	pull: function( ){
		return this.stat().mtime.getTime().toString( 36 ).toUpperCase()
	}
}})

$jin.atom.prop({ '$jin.file.base..exists': {
	put: function( exists ){
		if( exists == this.exists() ) return exists
		
        if( exists ){
            this.parent().exists( true )
            this.api().mkdirSync( this.path() )
        } else {
            this.nativeAPI().unlinkSync( this.path() )
        }
    },
	pull: function( ){
		var next = !!this.stat()
		return next
    }
}})

$jin.atom.prop({ '$jin.file.base..isDir': {
	pull: function( ){
		return this.stat().isDirectory()
	}
}})

$jin.atom.prop({ '$jin.file.base..isFile': {
	pull: function( ){
		return this.stat().isFile()
	}
}})

$jin.property( '$jin.file.base..name', function( ){
    return $node.path.basename( this.path() )
} )

$jin.property( '$jin.file.base..ext', function( ){
    return $node.path.extname( this.path() )
} )

$jin.atom.prop({ '$jin.file.base..content': {
	pull: function( content ){
    	var content = this.nativeAPI().readFileSync( this.path() )
		this.watcher()
		return content
	},
    put: function( next ){
		try {
			this.nativeAPI().mkdirSync( this.parent().path() )
		} catch( error ){
			if( error.code !== 'EEXIST' ) throw error
		}
		
		this.nativeAPI().writeFileSync( this.path(), next )
		
		return next
	}
}})

$jin.method( '$jin.file.base..append', function( string ){
    this.nativeAPI().appendFile( this.path(), string )
    return this
} )

$jin.method( '$jin.file.base..streamReader', function( options ){
    return this.nativeAPI().createReadStream( this.path(), options )
} )

$jin.method( '$jin.file.base..streamWriter', function( options ){
    return this.nativeAPI().createWriteStream( this.path(), options )
} )

$jin.method( '$jin.file.base..resolve', function( path ){
    path = $node.path.join( this.path(), path )
    return $jin.file( path )
} )

$jin.property( '$jin.file.base..parent', function( ){
    return this.resolve( '..' )
} )

$jin.method( '$jin.file.base..child', function( name ){
    return this.resolve( name )
} )

$jin.atom.prop({ '$jin.file.base..childList': {
	pull: function( ){
		
		var names= this.nativeAPI().readdirSync( this.path() )
		var dir = this
		
		//return $jin.lazyProxy( function( ){
			var childs = names.filter( function( name ){
				return !/^\./.test( name )
			} ).map( function( name ){
				return dir.child( name )
			} )
			//dir.childList( childs )
			this.watcher()
			return childs
		//} )
	}
}})

$jin.method( '$jin.file.base..find', function( include, exclude ){
    if( !include ) include = { test: function( ){ return true } }
    if( !exclude ) exclude = { test: function( ){ return false } }
    var found = []
    this.childList().forEach( function( child ){
        if( exclude.test( child ) ) return
        if( include.test( child ) ) found.push( child )
        if( !child.isDir() ) return
        found = found.concat( child.find( include, exclude ) )
    } )
    return found
} )

$jin.property( '$jin.file.base..load', function( ){
    return require( this.path() )
} )

$jin.method( '$jin.file.base..relate', function( base ){
    base = $jin.file( base || '.' )
    return $node.path.relative( base.path(), this.path() ).replace( /\\/g, '/' )
} )

$jin.method( '$jin.file.base..uri', function( base ){
    return $jin.uri({ path: this.relate( base ), query: { '': this.version() } })
} )

$jin.property({ '$jin.file.base..update': function( ){
    return $jin.schedule( 100, this.notify.bind( this ) )
}})

$jin.method({ '$jin.file.base..notify': function( ){
	this.update( void 0 )
	$jin.log( this.relate() )
	this.watcher_atom().notify()
}})

$jin.atom.prop({ '$jin.file.base..watcher': {
	pull: function( prev ){
		return this.parent().nativeWatcher()
	}
}})

$jin.atom.prop({ '$jin.file.base..nativeWatcher': {
	pull: function( prev ){
		var handler = $jin.sync2async( function jin_file_handle_change( eventName, fileName ){
			if( eventName === 'rename' ) return
			if( eventName !== 'change' ) $jin.log.error( new Error( 'Unknown event name (' + eventName + ')' ) )
			
			if( !fileName ) return
			if( /\.tmp$|[_~]$/.test( fileName ) ) return
			
			this.child( fileName ).update()
		}.bind( this ) )
		
		var watcher = this.nativeAPI().watch
		(   this.path()
		,   { persistent: false }
		,   handler
		)
		
		watcher.on( 'error', function(){
			this.update()
		}.bind( this ) )
		
		this.entangle({ destroy: function( ){
			watcher.close()
		} })
		
		return watcher
	}
}})

$jin.property({ '$jin.file.base.ext': function( ){
	return ''
}})

$jin.property({ '$jin.file.base.mime': function( ){
	return 'application/octet-stream'
}})

$jin.property({ '$jin.file.base.matcher': function( ){
	return RegExp( this.ext().replace( /\\./g, '\\.', 'i' ) + '$' )
}})

$jin.method({ '$jin.file.base.match': function( path ){
	return this.matcher().test( path )
}})

$jin.method({ '$jin.file.base.priority': function( path ){
	return this.matcher().source.length
}})

$jin.atom.prop({ '$jin.file.base..sourceList': {
	pull: function( ){
		if( this.isFile() ) return [ this ]
		
		return this.childList()
		.filter( function( file ){
			return /^[a-zA-Z].+\..+/.test( file.name() ) && file.isFile()
		} )
	}
}})

$jin.atom.prop({ '$jin.file.base..moduleList': {
	pull: function( ){
		return ( this.isDir() ? this.childList() : [ ] )
		.filter( function( file ){
			return /^[a-zA-Z]\w+$/.test( file.name() ) && file.isDir()
		} )
	}
}})

$jin.method( '$jin.file.base..deepModuleList', function( ){
    var moduleList = [ this ]
    
    this.moduleList().forEach( function( mod ){
        moduleList = moduleList.concat( mod.deepModuleList() )
    })
    
    return moduleList
} )

$jin.method( '$jin.file.base..require', function( ){
    if( this.exists() ) return this
    
    $jin.log.warn( 'Module (' + this.path() + ') not found. Search (' + this.name() + ') in repository...' )
    
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
    
    $jin.log.info( 'Installing (' + this.path() + ') from (' + repo + ')...' )
    
    $jin.execute( 'git', [ 'clone', repo, this.path() ] )
    
    return this
} )

$jin.method( '$jin.file.base..buildFile', function( prefix, vary, postfix ){
    var name = $jin.vary2string( prefix, vary, postfix )
    return this.child( '-mix' ).child( name )
} )

$jin.method({ '$jin.file.base..dependList': function( ){
	return [ ]
}})

$jin.method( '$jin.file.base..dependTree', function( vary, moduleList ){
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

$jin.method( '$jin.file.base..index', function( vary, moduleList ){
    var tree = this.dependTree( vary, moduleList )
    var index = []
    
    tree.forEach( function collect( node ){
        for( var key in node ){
            if( key ) collect( node[ key ] )
            else index = index.concat( node[ key ] )
        }
    })
    
    return index.map( $jin.file )
} )

$jin.method({ '$jin.file.base..jsFiles': function( ){
	return []
}})

$jin.method({ '$jin.file.base..cssFiles': function( ){
	return []
}})
