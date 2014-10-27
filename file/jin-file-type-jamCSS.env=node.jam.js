/**
 * @name $jin.file.type.jamCSS
 * @class $jin.file.type.jamCSS
 * @returns $jin.file.type.jamCSS
 * @mixins $jin.klass
 * @mixins $jin.file.type.css
 */
$jin.klass({ '$jin.file.type.jamCSS': [ '$jin.file.type.css' ] })

/**
 * @name $jin.file.type.jamCSS.ext
 * @method ext
 * @static
 * @member $jin.file.type.jamCSS
 */
$jin.method({ '$jin.file.type.jamCSS.ext': function( ){
	this['$jin.file.type.css.ext']
	return '.jam.css'
}})

/**
 * @name $jin.file.type.jamCSS#dependList
 * @method dependList
 * @member $jin.file.type.jamCSS
 */
$jin.atom1.prop({ '$jin.file.type.jamCSS..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {}
		
		String( this.content() )
		.replace
		(   /[.]([a-z0-9]{2,}(?:[-_][a-z0-9]{2,})+)\b/gi
		,   function( str, path ){
				depends[ path.replace( /[_-]/g, '/' ) ] = true
			}
		)
		
		return Object.keys( depends )
	}
}})
