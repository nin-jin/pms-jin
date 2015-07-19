/**
 * @name $jin.build#jsCompiled
 * @method jsCompiled
 * @member $jin.build
 */
$jin.atom1.prop({ '$jin.build..jsCompiled': {
	pull: function( prev ){
		
		var target = this.pack().buildFile( 'index', this.vary(), 'js' )
		var targetMap = target.parent().resolve( target.name() + '.map' )

		var concater = new $node[ 'concat-with-sourcemaps' ]( true, target.relate(), '\n;\n' )
		this.jsSources().forEach( function( src ){
			var srcMap = src.parent().resolve( src.name() + '.map' )
			var content = src.content().toString().replace( /# sourceMappingURL=/g , '' )
			if( srcMap.exists() ) {
				var json = JSON.parse( srcMap.content() )
				json.sources = json.sources.map( function( source ){
					return src.parent().resolve( source ).relate( target.parent() )
				})
				concater.add( src.relate(), content, JSON.stringify( json ) )
			} else {
				concater.add( src.relate( target.parent() ), content )
			}
		} )

		target.content( concater.content + '\n//# sourceMappingURL=' + targetMap.relate( target.parent() ) )
		targetMap.content( concater.sourceMap )

		$jin.log( target.relate() )
		
		return [ target , targetMap ]
	},
	merge: function( next, prev ){
		return ( String( next ) == String( prev ) ) ? prev : next
	}
}})
