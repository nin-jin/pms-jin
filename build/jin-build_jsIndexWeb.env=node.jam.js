$jin.atom.prop({ '$jin.build..jsIndexWeb': {
	pull: function( prev ){
		
		var target = this.pack().buildFile( this.pack().name(), this.vary(), 'js' )
		
		var lines = this.jsSources().map( function( src ){
			return '"' + $jin.file( src ).relate( target.parent() ) + '",'
		} )
		
		lines.unshift( "\
void function( modules ){                                                   \n\
    var scripts= document.getElementsByTagName( 'script' )                  \n\
    var script= document.currentScript || scripts[ scripts.length - 1 ]     \n\
    var dir= script.src.replace( /[^/]+$/, '' )                             \n\
    try {                                                                   \n\
        document.write( '' )                                                \n\
        var writable = true                                                 \n\
    } catch( error ){                                                       \n\
        var writable = false                                                \n\
    }                                                                       \n\
	if( writable ){                                                         \n\
		var buffer = []                                                     \n\
		var module; while( module = modules.shift() ){                      \n\
			buffer.push( '<script src=\"'+dir+module+'\"></script>' )       \n\
		}                                                                   \n\
		document.write( buffer.join( '' ) )                                 \n\
	} else {                                                                \n\
		var next= function( ){                                              \n\
			var module= modules.shift()                                     \n\
			if( !module ) return                                            \n\
			var loader= document.createElement( 'script' )                  \n\
			loader.parentScript= script                                     \n\
			loader.src= dir + module                                        \n\
			loader.onload= next                                             \n\
			script.parentNode.insertBefore( loader, script )                \n\
		}                                                                   \n\
	    next()                                                              \n\
	}                                                                       \n\
}.call( this, [                                                             \n\
		" )
		
		lines.push( " null ])" )
		
		target.content( lines.join( '\n' ) )
		
		$jin.log( target.relate() )
		
		return [ target ].concat( this.jsSources() )
	},
	merge: function( next, prev ){
		return ( String( next ) == String( prev ) ) ? prev : next
	}
}})
