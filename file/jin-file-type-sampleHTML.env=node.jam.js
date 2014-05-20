/**
 * @name $jin.file.type.sampleHTML
 * @class $jin.file.type.sampleHTML
 * @returns $jin.file.type.sampleHTML
 * @mixins $jin.klass
 * @mixins $jin.file.type.html
 */
$jin.klass({ '$jin.file.type.sampleHTML': [ '$jin.file.type.html' ] })

/**
 * @name $jin.file.type.sampleHTML.ext
 * @method ext
 * @static
 * @member $jin.file.type.sampleHTML
 */
$jin.method({ '$jin.file.type.sampleHTML.ext': function( ){
	this['$jin.file.type.html.ext']
	return '.sample.html'
}})

/**
 * @name $jin.file.type.sampleHTML#dependList
 * @method dependList
 * @member $jin.file.type.sampleHTML
 */
$jin.atom.prop.list({ '$jin.file.type.sampleHTML..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {}
		
		var content = String( this.content() )
		
		content
		.replace
		(   /<([a-z0-9]{2,}(?:[_-][a-z0-9]{2,})+)/gi
		,   function( str, path ){
				depends[ path.replace( /[_-]/g, '/' ) ] = true
			}
		)
		
		content
		.replace
		(   /[ \t\n]([a-z0-9]{2,}(?:[_-][a-z0-9]{2,})+)="/gi
		,   function( str, path ){
				depends[ path.replace( /[_-]/g, '/' ) ] = true
			}
		)
		
		return Object.keys( depends )
	}
}})

/**
 * @name $jin.file.type.sampleHTML#jsFiles
 * @method jsFiles
 * @member $jin.file.type.sampleHTML
 */
$jin.atom.prop.list({ '$jin.file.type.sampleHTML..jsFiles': {
	resolves: [ '$jin.file.base..jsFiles' ],
	pull: function( prev ){
		var target = this.parent().buildFile( this.name(), {}, 'js' )
		var content = '$jin.sample.strings( ' + JSON.stringify( String( this.content() ) ) + ' )'
		target.content( content )
		
		if( prev ) $jin.log( target.relate() )
		
		return [ target ]
	}
}})
