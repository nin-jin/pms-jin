/**
 * @name $jin.file.base
 * @class $jin.file.base
 * @returns $jin.file.base
 * @mixins $jin.klass
 * @mixins $jin.registry
 */
$jin.klass({ '$jin.file.base': [ '$jin.registry' ] })

/**
 * @name $jin.file.base.nativeAPI
 * @method nativeAPI
 * @static
 * @member $jin.file.base
 */
$jin.property({ '$jin.file.base.nativeAPI': function( ){
    return /*$jin.fiberize*/( $node['fs'] )
}})

/**
 * @name $jin.file.base#id
 * @method id
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..id': function(){
	this['$jin.registry..id']
	return this.path.apply( this, arguments )
}})

/**
 * @name $jin.file.base#path
 * @method path
 * @member $jin.file.base
 */
$jin.property({ '$jin.file.base..path': function( path ){
	if( path ) path = String( path )
	else path = ''
	
	path = $node.path.resolve( path ).replace( /\\/g, '/' )
	
	//this['$jin.registry..id']( path )
    return path
}})
    
/**
 * @name $jin.file.base#stat
 * @method stat
 * @member $jin.file.base
 */
$jin.atom1.prop({ '$jin.file.base..stat': {
	pull: function( prev ){
		try {
			var stat = this.constructor.nativeAPI().statSync( this.path() )
			//this.watcher()
		} catch( error ){
			if( error.code !== 'ENOENT' ) throw error
			stat = null
		}
		return stat
	}
}})

/**
 * @name $jin.file.base#version
 * @method version
 * @member $jin.file.base
 */
$jin.atom1.prop({ '$jin.file.base..version': {
	pull: function( ){
		var stat = this.stat()
		if( !stat ) return ''
		
		return stat.mtime.getTime().toString( 36 ).toUpperCase()
	}
}})

/**
 * @name $jin.file.base#exists
 * @method exists
 * @member $jin.file.base
 */
$jin.atom1.prop({ '$jin.file.base..exists': {
	put: function( exists ){
		if( exists == this.exists() ) return exists
		
		var api = this.constructor.nativeAPI()
		var path = this.path()
        if( exists ){
            this.parent().exists( true )
			try {
				api.mkdirSync( path )
			} catch( error ){
				if( error.code !== 'EEXIST' ) throw error
			}
        } else {
			try {
	            api.unlinkSync( path )
			} catch( error ){
				if( error.code !== 'ENOEXIST' ) throw error
			}
        }
		
		return exists
    },
	pull: function( ){
		var next = !!this.stat()
		return next
    }
}})

/**
 * @name $jin.file.base#isDir
 * @method isDir
 * @member $jin.file.base
 */
$jin.atom1.prop({ '$jin.file.base..isDir': {
	pull: function( ){
		var stat = this.stat()
		if( !stat ) return stat
		
		return stat.isDirectory()
	}
}})

/**
 * @name $jin.file.base#isFile
 * @method isFile
 * @member $jin.file.base
 */
$jin.atom1.prop({ '$jin.file.base..isFile': {
	pull: function( ){
		var stat = this.stat()
		if( !stat ) return false
		
		return stat.isFile()
	}
}})

/**
 * @name $jin.file.base#name
 * @method name
 * @member $jin.file.base
 */
$jin.property({ '$jin.file.base..name': function( ){
    return $node.path.basename( this.path() )
}})

/**
 * @name $jin.file.base#ext
 * @method ext
 * @member $jin.file.base
 */
$jin.property({ '$jin.file.base..ext': function( ){
    return $node.path.extname( this.path() )
}})

/**
 * @name $jin.file.base#content
 * @method content
 * @member $jin.file.base
 */
$jin.atom1.prop({ '$jin.file.base..content': {
	pull: function( content ){
		try {
			var content = this.constructor.nativeAPI().readFileSync( this.path() )
			//this.watcher()
		} catch( error ){
			error.message += ' (' + this.path() + ')'
			throw error
		}
		return content
	},
    put: function( next ){
		this.parent().exists( true )
		
		this.constructor.nativeAPI().writeFileSync( this.path(), next )
		this.stat( void 0 )
		
		return next
	}
}})

/**
 * @name $jin.file.base#append
 * @method append
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..append': function( string ){
    this.constructor.nativeAPI().appendFile( this.path(), string )
    return this
}})

/**
 * @name $jin.file.base#streamReader
 * @method streamReader
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..streamReader': function( options ){
    return this.constructor.nativeAPI().createReadStream( this.path(), options )
}})

/**
 * @name $jin.file.base#streamWriter
 * @method streamWriter
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..streamWriter': function( options ){
    return this.constructor.nativeAPI().createWriteStream( this.path(), options )
}})

/**
 * @name $jin.file.base#resolve
 * @method resolve
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..resolve': function( path ){
    path = $node.path.join( this.path(), path )
    return $jin.file( path )
}})

/**
 * @name $jin.file.base#parent
 * @method parent
 * @member $jin.file.base
 */
$jin.property({ '$jin.file.base..parent': function( ){
    return this.resolve( '..' )
}})

/**
 * @name $jin.file.base#child
 * @method child
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..child': function( name ){
    return this.resolve( name )
}})

/**
 * @name $jin.file.base#childList
 * @method childList
 * @member $jin.file.base
 */
$jin.atom1.prop({ '$jin.file.base..childList': {
	pull: function( ){
		
		var names= this.constructor.nativeAPI().readdirSync( this.path() )
		var dir = this
		
		//return $jin.lazyProxy( function( ){
			var childs = names.filter( function( name ){
				return !/^\./.test( name )
			} ).map( function( name ){
				return dir.child( name )
			} )
			//dir.childList( childs )
			//this.watcher()
			return childs
		//} )
	}
}})

/**
 * @name $jin.file.base#find
 * @method find
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..find': function( include, exclude ){
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
}})

/**
 * @name $jin.file.base#load
 * @method load
 * @member $jin.file.base
 */
$jin.property({ '$jin.file.base..load': function( ){
    return require( this.path() )
}})

/**
 * @name $jin.file.base#relate
 * @method relate
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..relate': function( base ){
    base = $jin.file( base || '.' )
    return $node.path.relative( base.path(), this.path() ).replace( /\\/g, '/' )
}})

/**
 * @name $jin.file.base#uri
 * @method uri
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..uri': function( base ){
    return $jin.uri({ path: this.relate( base ), query: { '': this.version() } })
}})

/**
 * @name $jin.file.base#update
 * @method update
 * @member $jin.file.base
 */
$jin.property({ '$jin.file.base..update': function( ){
    return new $jin.schedule( 100, this.notify.bind( this ) )
}})

/**
 * @name $jin.file.base#notify
 * @method notify
 * @member $jin.file.base
 */
//$jin.method({ '$jin.file.base..notify': function( ){
//	this.update( void 0 )
//	this.watcher_atom().notify()
//}})

/**
 * @name $jin.file.base#watcher
 * @method watcher
 * @member $jin.file.base
 */
//$jin.atom1.prop({ '$jin.file.base..watcher': {
//	pull: function( prev ){
//		return this.parent().nativeWatcher()
//	}
//}})

/**
 * @name $jin.file.base#nativeWatcher
 * @method nativeWatcher
 * @member $jin.file.base
 */
//$jin.atom1.prop({ '$jin.file.base..nativeWatcher': {
//	pull: function( prev ){
//		var handler = $jin.sync2async( function jin_file_handle_change( eventName, fileName ){
//			if( eventName === 'rename' ) return
//			if( eventName !== 'change' ) $jin.log.error( new Error( 'Unknown event name (' + eventName + ')' ) )
//
//			if( !fileName ) return
//			if( /\.tmp$|[_~]$/.test( fileName ) ) return
//
//			this.child( fileName ).update()
//		}.bind( this ) )
//
//		var watcher = this.constructor.nativeAPI().watch
//		(   this.path()
//		,   { persistent: false }
//		,   handler
//		)
//
//		watcher.on( 'error', function(){
//			this.update()
//		}.bind( this ) )
//
//		this.entangle({ destroy: function( ){
//			watcher.close()
//		} })
//
//		return watcher
//	}
//}})

/**
 * @name $jin.file.base.ext
 * @method ext
 * @static
 * @member $jin.file.base
 */
$jin.property({ '$jin.file.base.ext': function( ){
	return ''
}})

/**
 * @name $jin.file.base.mime
 * @method mime
 * @static
 * @member $jin.file.base
 */
$jin.property({ '$jin.file.base.mime': function( ){
	return 'application/octet-stream'
}})

/**
 * @name $jin.file.base.matcher
 * @method matcher
 * @static
 * @member $jin.file.base
 */
$jin.property({ '$jin.file.base.matcher': function( ){
	return RegExp( this.ext().replace( /\./g, '\\.' ) + '$', 'i' )
}})

/**
 * @name $jin.file.base.match
 * @method match
 * @static
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base.match': function( path ){
	return this.matcher().test( path )
}})

/**
 * @name $jin.file.base.priority
 * @method priority
 * @static
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base.priority': function( path ){
	return this.matcher().source.length
}})

/**
 * @name $jin.file.base#sourceList
 * @method sourceList
 * @member $jin.file.base
 */
$jin.atom1.prop({ '$jin.file.base..sourceList': {
	pull: function( ){
		if( this.isFile() ) return [ this ]
		
		return this.childList()
		.filter( function( file ){
			return /^[a-zA-Z].+\..+/.test( file.name() ) && file.isFile()
		} )
	}
}})

/**
 * @name $jin.file.base#moduleList
 * @method moduleList
 * @member $jin.file.base
 */
$jin.atom1.prop({ '$jin.file.base..moduleList': {
	pull: function( ){
		return ( this.isDir() ? this.childList() : [ ] )
		.filter( function( file ){
			return /^[a-zA-Z]\w+$/.test( file.name() ) && file.isDir()
		} )
	}
}})

/**
 * @name $jin.file.base#deepModuleList
 * @method deepModuleList
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..deepModuleList': function( ){
    var moduleList = [ this ]
    
    this.moduleList().forEach( function( mod ){
        moduleList = moduleList.concat( mod.deepModuleList() )
    })
    
    return moduleList
}})

/**
 * @name $jin.file.base#require
 * @method require
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..require': function( ){
    if( this.exists() ) return this
    
    $jin.log.warn( 'Module (' + this.path() + ') not found. Search (' + this.name() + ') in repository...' )
    
    $jin.async2sync( $node.npm.load ).call( $node.npm, {} )
    var meta = $jin.async2sync( $node.npm.commands.view ).call( $node.npm.commands, [ 'pms-' + this.name(), 'repository' ] )
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
}})

/**
 * @name $jin.file.base#buildFile
 * @method buildFile
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..buildFile': function( prefix, vary, postfix ){
    var name = $jin.vary2string( prefix, vary, postfix )
    return this.child( '-mix' ).child( name )
}})

/**
 * @name $jin.file.base#dependList
 * @method dependList
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..dependList': function( ){
	return [ ]
}})

/**
 * @name $jin.file.base#index
 * @method index
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..index': function( vary, moduleList ){
    var tree = this.dependTree( vary, moduleList )
    var index = []
    
    tree.forEach( function collect( node ){
        for( var key in node ){
            if( key ) collect( node[ key ] )
            else index = index.concat( node[ key ] )
        }
    })
    
    return index.map( $jin.file )
}})

/**
 * @name $jin.file.base#jsFiles
 * @method jsFiles
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..jsFiles': function( ){
	return []
}})

/**
 * @name $jin.file.base#cssFiles
 * @method cssFiles
 * @member $jin.file.base
 */
$jin.method({ '$jin.file.base..cssFiles': function( ){
	return []
}})
