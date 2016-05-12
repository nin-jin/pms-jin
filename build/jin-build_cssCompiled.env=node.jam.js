/**
 * @name $jin.build#cssCompiled
 * @method cssCompiled
 * @member $jin.build
 */
$jin.atom1.prop.list({ '$jin.build..cssCompiled': {
	pull: function( prev ){
		var target = this.pack().buildFile( 'index', this.vary(), 'css' )
		var targetMap = target.parent().resolve( target.name() + '.map' )

		var root = null //$node.postcss.root({})
		this.cssSources().forEach( function( src ){
			var root2 = $node.postcss.parse( src.content() , { from : src.path() } )
			if( root ) root = root.append( root2 )
			else root = root2
		} )

		var cssnext = $node.cssnext
		var processor = $node.postcss( cssnext().plugins )
		var result = processor.process( root , { to : target.relate() , map : { inline : false } } )
		target.content( result.css )
		targetMap.content( JSON.stringify( result.map , null , '\t' ) )
		
		$jin.log( target.relate() ) 
		
		return [ target , targetMap ]
	}
}})
