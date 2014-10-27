/**
 * @name $jin.build#cssCompiled
 * @method cssCompiled
 * @member $jin.build
 */
$jin.atom1.prop.list({ '$jin.build..cssCompiled': {
	pull: function( prev ){
		var target = this.pack().buildFile( 'index', this.vary(), 'css' )
		
		var sources = this.cssSources()
		
		var content = sources.map( function( src ){
			return src.content()
		}).join( '\n' )
		
		target.content( content )
		
		$jin.log( target.relate() ) 
		
		return [ target ]
	}
}})
