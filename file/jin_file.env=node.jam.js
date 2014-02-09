$jin.klass({ '$jin.file.onChange': [ '$jin.event' ] })

$jin.klass.old( '$jin.registry', '$jin.crier', '$jin.file' )

$jin.property( '$jin.file.api', function( ){
    return /*$jin.fiberize*/( $node['fs'] )
} )

$jin.alias( '$jin.registry..id', '$jin.file..id', 'path' )

$jin.property( '$jin.file..path', function( path ){
	if( path ) path = String( path )
	else path = ''
	
	path = $node.path.resolve( path ).replace( /\\/g, '/' )
	
	//this['$jin.registry..id']( path )
    return path
} )
    
$jin.property( '$jin.file..stat', function( ){
    return this.constructor.api().statSync( this.path() )
} )

$jin.property( '$jin.file..version', function( ){
    return this.stat().mtime.getTime().toString( 36 ).toUpperCase()
} )

$jin.property( '$jin.file..exists', function( exists ){
    if( arguments.length ){
        if( exists ){
            if( this.exists() ) return exists
            this.parent().exists( true )
            this.constructor.api().mkdirSync( this.path() )
        } else {
            this.constructor.api().unlinkSync( this.path() )
        }
    } else {
        try {
            return !!this.stat().valueOf()
        } catch( error ){
            if( error.code === 'ENOENT' ) return false
            throw error
        }
    }
} )

$jin.property( '$jin.file..isDir', function( ){
    return this.stat().isDirectory()
} )

$jin.property( '$jin.file..isFile', function( ){
    return this.stat().isFile()
} )

$jin.property( '$jin.file..name', function( ){
    return $node.path.basename( this.path() )
} )

$jin.property( '$jin.file..ext', function( ){
    return $node.path.extname( this.path() )
} )

$jin.property( '$jin.file..content', function( content ){
    if( !arguments.length ) return this.constructor.api().readFileSync( this.path() )
    
    //content = String( content )
    
    try {
        this.constructor.api().mkdirSync( this.parent().path() )
    } catch( error ){
        if( error.code !== 'EEXIST' ) throw error
    }
    
    this.constructor.api().writeFileSync( this.path(), content )
    return content
} )

$jin.method( '$jin.file..append', function( string ){
    this.constructor.api().appendFile( this.path(), string )
    return this
} )

$jin.method( '$jin.file..streamReader', function( options ){
    return this.constructor.api().createReadStream( this.path(), options )
} )

$jin.method( '$jin.file..streamWriter', function( options ){
    return this.constructor.api().createWriteStream( this.path(), options )
} )

$jin.method( '$jin.file..resolve', function( path ){
    path = $node.path.join( this.path(), path )
    return this.constructor.apply( null, [ path ] )
} )

$jin.property( '$jin.file..parent', function( ){
    return this.resolve( '..' )
} )

$jin.method( '$jin.file..child', function( name ){
    return this.resolve( name )
} )

$jin.property( '$jin.file..childList', function( childs ){
    if( arguments.length ) return childs
    
    var names= this.constructor.api().readdirSync( this.path() )
    var dir = this
    
    //return $jin.lazyProxy( function( ){
        var childs = names.filter( function( name ){
            return !/^\./.test( name )
        } ).map( function( name ){
            return dir.child( name )
        } )
        //dir.childList( childs )
        return childs
    //} )
} )

$jin.method( '$jin.file..find', function( include, exclude ){
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

$jin.property( '$jin.file..load', function( ){
    return require( this.path() )
} )

$jin.method( '$jin.file..relate', function( base ){
    base = this.constructor.apply( this.constructor, [ base || '.' ] )
    return $node.path.relative( base.path(), this.path() ).replace( /\\/g, '/' )
} )

$jin.method( '$jin.file..uri', function( base ){
    return $jin.uri({ path: this.relate( base ), query: { '': this.version() } })
} )

$jin.property( '$jin.file..watcher', function( ){
    var file = this
    
    var handler = $jin.sync2async( function( eventName, fileName ){
		if( /\.tmp$|~/.test( fileName ) ) return
		
        var target = fileName ? file.child( fileName ) : file
        
		file.stat( void 0 )
        if( file.exists() && file.isDir() ){
            var handlers = file.listenerMap()[ $jin.file.onChange ]
            file.childList( void 0 ).childList().forEach( function( child ){
                child.stat( void 0 )
                if( !child.isDir() ) return
                
                handlers.forEach( function( handler ){
                    child.listen( handler )
                } )
            } )
        }
        
        file.scream( $jin.file.onChange({ target: target }) )
    } )
    
    var watcher
    var domain = $node.domain.create()
    domain.on( 'error', handler )
    domain.run( function( ){
        watcher = file.constructor.api().watch
        (   file.path()
        ,   { persistent: true }
        ,   handler
        )
    })
    
    this.entangle({ destroy: function( ){
        watcher.close()
    } })
    
    return watcher
} )

$jin.method( '$jin.crier..listen', '$jin.file..listen', function( onChange ){
    this.watcher()
    
    if( this.isDir() ){
        this.childList().forEach( function( child ){
            if( !child.isDir() ) return
            child.listen( onChange )
        } ) 
    }
    
    return this['$jin.crier..listen']( $jin.file.onChange, onChange )
} )

$jin.method( '$jin.crier..forget', '$jin.file..forget', function( onChange ){
    this.watcher()
    
    if( this.isDir() ){
        this.childList().forEach( function( child ){
            child.forget( onChange )
        } )
    }
    
    return this['$jin.crier..forget']( $jin.file.onChange, onChange )
} )
