$jin.atom.prop({ '$jin.build..jsIndexNode': {
	pull: function( prev ){
		
		var target = this.pack().buildFile( this.pack().name(), this.vary(), 'js' )
		
		var lines = this.jsSources().map( function( src ){
			return '("' + $jin.file( src ).relate( target.parent() ) + '")'
		} )
		
		lines.unshift( "\
void function( path ){                                   \n\
    path = require( 'path' ).resolve( __dirname, path )  \n\
    var fs = require( 'fs' )                             \n\
    var source= fs.readFileSync( path )                  \n\
    source= 'with(this){' + source + '}'                 \n\
    module._compile( source, path )                      \n\
    return arguments.callee                              \n\
}                                                        \n\
		" )
		
		target.content( lines.join( '\n' ) )
		
		$jin.log( target.relate() )
		
		return [ target ].concat( this.jsSources() )
	},
	merge: function( next, prev ){
		return ( String( next ) == String( prev ) ) ? prev : next
	}
}})
