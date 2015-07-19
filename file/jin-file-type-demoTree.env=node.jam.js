/**
 * @name $jin.file.type.demoTree
 * @class $jin.file.type.demoTree
 * @returns $jin.file.type.demoTree
 * @mixins $jin.klass
 * @mixins $jin.file.type.tree
 */
$jin.klass({ '$jin.file.type.demoTree': [ '$jin.file.type.tree' ] })

/**
 * @name $jin.file.type.demoTree.ext
 * @method ext
 * @static
 * @member $jin.file.type.demoTree
 */
$jin.method({ '$jin.file.type.demoTree.ext': function( ){
	this['$jin.file.type.tree.ext']
	return '.demo.tree'
}})

/**
 * @name $jin.file.type.demoTree#dependList
 * @method dependList
 * @member $jin.file.type.demoTree
 */
$jin.atom1.prop({ '$jin.file.type.demoTree..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {}
		
		String( this.content() )
		.replace
		(   /([a-z][a-z0-9]+(?:-[a-z0-9]+)+)/ig
		,   function( str, path ){
				depends[ path.replace( /[._-]/g, '/' ) ] = 0
			}
		)
		
		return depends
	}
}})

/**
 * @name $jin.file.type.demoTree#jsFiles
 * @method jsFiles
 * @member $jin.file.type.demoTree
 */
$jin.atom1.prop.list({ '$jin.file.type.demoTree..jsFiles': {
	resolves: [ '$jin.file.base..jsFiles' ],
	pull: function( prev ){
		var target = this.parent().buildFile( this.name(), {}, 'js' )
		
		var content = '$jin.sample.demo.strings( ' + JSON.stringify( String( this.content() ) ) + ' )'
		
		target.content( content )
		
		if( prev ) $jin.log( target.relate() )
		
		return [ target ]
	}
}}) 
