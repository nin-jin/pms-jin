/**
 * @name $jin.file.type.ts
 * @class $jin.file.type.ts
 * @returns $jin.file.type.ts
 * @mixins $jin.klass
 * @mixins $jin.file.type.html
 */
$jin.klass({ '$jin.file.type.ts': [ '$jin.file.type.text' ] })

/**
 * @name $jin.file.type.ts.ext
 * @method ext
 * @static
 * @member $jin.file.type.ts
 */
$jin.method({ '$jin.file.type.ts.ext': function( ){
	this['$jin.file.type.text.ext']
	return '.ts'
}})

/**
 * @name $jin.file.type.ts#dependList
 * @method dependList
 * @member $jin.file.type.ts
 */
$jin.atom.prop.list({ '$jin.file.type.ts..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {}
		
		String( this.content() )
		.replace( /\/\*[\s\S]*?\*\//g, '' )
		.replace
		(   /\$([a-z][a-z0-9]+(?:[._][a-z0-9]+)*)/ig
		,   function( str, path ){
				depends[ path.replace( /[._-]/g, '/' ) ] = true
			}
		)
		
		return Object.keys( depends )
	}
}})
