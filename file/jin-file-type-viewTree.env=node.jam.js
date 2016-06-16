$jin.klass({ '$jin.file.type.viewTree': [ '$jin.file.type.tree' ] })

$jin.method({ '$jin.file.type.viewTree.ext': function( ){
	this['$jin.file.type.tree.ext']
	return '.view.tree'
}})

$jin.atom1.prop({ '$jin.file.type.viewTree..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {
			//'jin2/prop' : 0,
		}
		
		String( this.content() )
		.replace
		(   /[@$]([a-z][a-z0-9]+(?:_[a-z0-9]+)+)/ig
		,   function( str, path ){
				depends[ path.replace( /[_]/g, '/' ) ] = 0
			}
		)
		
		return depends
	}
}})

$jin.atom1.prop.list({ '$jin.file.type.viewTree..jsFiles': {
	resolves: [ '$jin.file.base..jsFiles' ],
	pull: function( prev ){
		var target = this.parent().buildFile( this.name(), {}, 'ts' )
		var tree = $jin_tree2.fromString( String( this.content() ) , this.relate() )

		var content = $mol_viewer_tree2ts( tree )

		target.content( content )

		if( prev ) $jin.log( target.relate() )

		return [ target ]
	}
}}) 
