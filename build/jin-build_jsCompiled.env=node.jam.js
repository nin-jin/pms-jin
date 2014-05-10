/**
 * @name $jin.build#jsCompiled
 * @method jsCompiled
 * @member $jin.build
 */
$jin.atom.prop({ '$jin.build..jsCompiled': {
	pull: function( prev ){
		
		var target = this.pack().buildFile( 'index', this.vary(), 'js' )
		
		var chunks = this.jsSources().map( function( src ){
			return ';// ' + src.relate( target.parent() ) + '\n' + src.content()
		} )
		
		chunks.unshift( "with( this ){" )
		chunks.push( "}" )
		
		target.content( chunks.join( '\n' ) )
		
		$jin.log( target.relate() )
		
		return [ target ]
	},
	merge: function( next, prev ){
		return ( String( next ) == String( prev ) ) ? prev : next
	}
}})
