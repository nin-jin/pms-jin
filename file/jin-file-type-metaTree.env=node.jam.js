$jin.klass({ '$jin.file.type.metaTree': [ '$jin.file.type.tree' ] })

$jin.method({ '$jin.file.type.metaTree.ext': function( ){
	resolves: '$jin.file.type.tree.ext'
	return '.meta.tree'
}})

$jin.atom.prop({ '$jin.file.type.metaTree..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {}
		
		var meta= $jin.tree.parse( this.content() )
		meta.select(' include / ').values().forEach( function( path ){
			depends[ path.trim() ] = true
		} )
		
		return Object.keys( depends )
	}
}})
