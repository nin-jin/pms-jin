/**
 * @name $jin.file.type.metaTree
 * @class $jin.file.type.metaTree
 * @returns $jin.file.type.metaTree
 * @mixins $jin.klass
 * @mixins $jin.file.type.tree
 */
$jin.klass({ '$jin.file.type.metaTree': [ '$jin.file.type.tree' ] })

/**
 * @name $jin.file.type.metaTree.ext
 * @method ext
 * @static
 * @member $jin.file.type.metaTree
 */
$jin.method({ '$jin.file.type.metaTree.ext': function( ){
	this['$jin.file.type.tree.ext']
	return '.meta.tree'
}})

/**
 * @name $jin.file.type.metaTree#dependList
 * @method dependList
 * @member $jin.file.type.metaTree
 */
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
